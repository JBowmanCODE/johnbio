/**
 * UNIVERSAL API PROXY WORKER
 * ===========================
 * A single Cloudflare Worker that proxies requests to multiple AI APIs.
 * API keys are stored securely in Cloudflare Worker Secrets (never in code).
 *
 * SETUP INSTRUCTIONS:
 * -------------------
 * 1. Deploy this worker in your Cloudflare dashboard
 * 2. Go to Worker > Settings > Variables > Secrets and add:
 *      ANTHROPIC_API_KEY  → your Claude API key (sk-ant-...)
 *      OPENAI_API_KEY     → your OpenAI API key (sk-...)
 *      GEMINI_API_KEY     → your Google Gemini API key (optional)
 *
 * 3. CREATE A KV NAMESPACE for rate limiting:
 *      - Go to Workers & Pages → KV → Create namespace → name it "RATE_LIMIT"
 *      - Go to your Worker → Settings → Bindings → Add binding
 *      - Variable name: RATE_LIMIT, KV Namespace: the one you just created
 *
 * RATE LIMITING:
 *      20 requests per IP per day (resets at midnight UTC)
 *      Responses include headers showing remaining quota:
 *        X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 *
 * ENDPOINTS:
 *      POST /claude   → proxies to Anthropic API
 *      POST /openai   → proxies to OpenAI API
 *      POST /gemini   → proxies to Google Gemini API
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://johnb.io',
  'https://www.johnb.io',
];

const RATE_LIMIT_MAX = 20;       // max requests per IP
const RATE_LIMIT_WINDOW = 86400; // 24 hours in seconds

// WORKER_SECRET is stored as a Cloudflare Worker Secret (env.WORKER_SECRET)
// Set it via: Cloudflare Dashboard → Worker → Settings → Variables → Secrets
// Name: WORKER_SECRET  Value: <random string>

// ── RATE LIMITER ─────────────────────────────────────────────────────────────
async function checkRateLimit(ip, kvStore) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `rl:${ip}:${today}`;

  const current = await kvStore.get(key);
  const count = current ? parseInt(current) : 0;

  if (count >= RATE_LIMIT_MAX) {
    return { allowed: false, count, remaining: 0 };
  }

  await kvStore.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW });

  return { allowed: true, count: count + 1, remaining: RATE_LIMIT_MAX - count - 1 };
}

// ── MAIN HANDLER ─────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {

    const origin = request.headers.get('Origin');
    const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
    const workerSecret = request.headers.get('X-Worker-Secret');

    // ── CORS headers ───────────────────────────────────────────────────────
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Worker-Secret',
      'Vary': 'Origin',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ── ORIGIN CHECK ───────────────────────────────────────────────────────
    // Allow requests from: (a) known browser origins, OR (b) trusted worker secret
    const isAllowedOrigin = origin !== null && ALLOWED_ORIGINS.includes(origin);
    const isWorkerCall = env.WORKER_SECRET && workerSecret === env.WORKER_SECRET;

    if (!isAllowedOrigin && !isWorkerCall) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── RATE LIMIT CHECK ───────────────────────────────────────────────────
    if (!env.RATE_LIMIT) {
      console.warn('RATE_LIMIT KV binding not configured');
    } else {
      const rl = await checkRateLimit(ip, env.RATE_LIMIT);

      if (!rl.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: `You have used all ${RATE_LIMIT_MAX} daily requests. Resets at midnight UTC.`,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
              'X-RateLimit-Remaining': '0',
              'Retry-After': '86400',
            },
          }
        );
      }

      corsHeaders['X-RateLimit-Limit'] = String(RATE_LIMIT_MAX);
      corsHeaders['X-RateLimit-Remaining'] = String(rl.remaining);
    }

    // ── PARSE BODY ─────────────────────────────────────────────────────────
    const url = new URL(request.url);
    const path = url.pathname;
    let body;

    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── CLAUDE (Anthropic) ─────────────────────────────────────────────────
    if (path === "/claude" || body.provider === "claude") {
      if (!env.ANTHROPIC_API_KEY) {
        return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Strip internal routing fields before forwarding
      const { provider: _p, ...claudeBody } = body;

      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(claudeBody),
      });

      const data = await upstream.json();
      return new Response(JSON.stringify(data), {
        status: upstream.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── OPENAI ─────────────────────────────────────────────────────────────
    if (path === "/openai" || body.provider === "openai") {
      if (!env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await upstream.json();
      return new Response(JSON.stringify(data), {
        status: upstream.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── GEMINI (Google) ────────────────────────────────────────────────────
    if (path === "/gemini" || body.provider === "gemini") {
      if (!env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const model = body.model || 'gemini-2.5-flash-lite';
      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const data = await upstream.json();
      return new Response(JSON.stringify(data), {
        status: upstream.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── UNKNOWN ROUTE ──────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        error: 'Unknown endpoint',
        available: ['/claude', '/openai', '/gemini'],
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  },
};
