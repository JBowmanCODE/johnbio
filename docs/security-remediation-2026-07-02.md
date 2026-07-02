# Security remediation — 2 July 2026

Fixes applied after the security audit. This file lives in `docs/` and is excluded from the FTP deploy.

## What changed (code)

### Cloudflare Workers (all 19)
Every worker now:
- Restricts CORS to `https://johnb.io` / `https://www.johnb.io` (no `*`, no origin reflection) and returns **403** for a disallowed browser origin.
- Returns **generic** error strings to the client (no `error.message`, no `error.stack`, no upstream provider error body). Real detail is logged server-side only.
- Fails **closed** (503) if its rate-limit KV binding is missing, instead of running unmetered.

Specific fixes:
- **lm-chat**: caps `max_tokens` (2048) and restricts models to an allowlist for public callers; trusted worker-secret callers (e.g. cv-cover-letter) bypass both. Rate limiter fails closed.
- **llms-generator**: SSRF guard — validates the fetched URL is a public http(s) address (blocks localhost, `169.254.x` metadata, private ranges, IPv6 literals, embedded creds) and no longer follows redirects.
- **editor**: removed the `error.stack` leak; restricted CORS; fails closed; input cap 20k chars.
- **genz, michael-scott, youtube-analyzer, youtube-summary**: added per-IP + global rate limiting (previously none). youtube-analyzer also caps playlist pagination at 20 pages to stop YouTube-quota amplification, and validates inputs. youtube-summary validates the 11-char video ID.
- **eu-ai-act**: rate limit now keyed on `CF-Connecting-IP` (was the spoofable `X-User-Token`).
- **transcripts**: rate limit now keyed on `CF-Connecting-IP` (was spoofable `X-Forwarded-For`); KV fail-closed.
- **igaming-jargon, promo-copy**: added input length caps (12k).

### Frontend
- **transcripts.js**: markdown from the AI is now sanitised with DOMPurify (added to `transcripts.html` with SRI) before `innerHTML`; the video-embed ID is validated against `^[A-Za-z0-9_-]{11}$`. Cache bumped to `?v=3`.
- **editor.js**: AI output escaped before `innerHTML`. Cache bumped to `?v=2`.
- **aitocv.js**: AI output escaped before `innerHTML` (score analysis, missing skills, interview prep). Cache bumped to `?v=2`.

### Repo / deploy
- Deleted `filter.txt` (leaked Google API key) and `_unlink_test.tmp`; removed local `error_log`.
- Untracked `workers/lm-chat-worker.js` (it was the one tracked worker and was being served publicly at `/workers/lm-chat-worker.js`).
- `.github/workflows/deploy.yml` exclude list now blocks `workers/**`, `.claude/**`, `CLAUDE.md`, `*.py`, `flask_app/**`, `docs/**`, `firestore.rules`, `filter.txt`, `error_log`, `*.log`.
- Added `firestore.rules` (see the certificate section below).

## Manual steps you must still do (cannot be done from code)

1. **Rotate the Google API key** `AIzaSy…F743k` in Google Cloud Console → Credentials. Apply API + HTTP-referrer restrictions to the replacement. If it's the same value as the `YOUTUBE_API_KEY` worker secret, update that secret too.
2. **Delete the already-uploaded files from the live host** via Namecheap cPanel File Manager: `filter.txt`, `workers/` (the whole folder), `CLAUDE.md`, `flask_app/`, `*.py`, and the old `error_log`. Excluding them from future deploys does not remove copies already on the server.
3. **Add the `RATE_LIMIT_KV` binding** to the `genz`, `michael-scott`, and `youtube-analyzer` workers in the Cloudflare dashboard (Settings → Bindings). They had no KV before and now **fail closed (503)** without it. (michael-scott/youtube-analyzer use the global `RATE_LIMIT_KV`; genz uses `env.RATE_LIMIT_KV`.)
4. **Redeploy all workers** via Wrangler (they deploy separately from the site).
5. **Deploy `firestore.rules`** — but read the file header first. Certificates are currently minted in the browser and cannot be made non-forgeable by rules alone; the real fix is to move exam scoring + certificate issuance into a Firebase Cloud Function (Admin SDK). The rules file gives you the secure target and a transitional option.
6. Delete or disable the orphaned `youtube-analyzer` and `youtube-summary` workers in Cloudflare if you don't use them.

## How to test — see the main handover for the full command list.
