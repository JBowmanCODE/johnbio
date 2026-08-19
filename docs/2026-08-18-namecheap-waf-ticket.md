# Namecheap support ticket — WAF blocking search engine crawlers

Raised 18 August 2026. Paste the block below into a Namecheap support ticket
(Hosting → Shared Hosting → the johnb.io package).

---

## Subject

Did server-level bot protection change on johnb.io around 28-29 July 2026?

> UPDATE 18 Aug: a Search Console fetch of the homepage returned the real page,
> not the challenge. The gate is NOT firing for Google today. That does not
> clear late July, so question (a) below is now the main thing being asked.
> Send this anyway; the whitelist request in (b) is cheap insurance.

## Body

Hello,

My site johnb.io is on your shared hosting. On 29 July 2026 my Google Search
Console impressions dropped from 268 the previous day to 1, in a single day,
with no code deployed to the site in that window. The site had been running
normally for months before that.

I think the cause may be server-level bot protection rather than anything on my
site. A Search Console fetch today returns my real homepage, so whatever the
cause was, it is not blocking Google at this moment. But here is what I can
still see from outside:

1. Requests to paths on my domain are being served an interstitial page titled
   "Checking your browser…". It returns HTTP 200 with roughly 745 bytes of
   content, sets a cookie named `hc_js_gate`, and then reloads the page:

       document.cookie='hc_js_gate=1;path=/;SameSite=Lax;Max-Age=3600';
       setTimeout(function(){location.reload()},300)

2. Search engine crawlers do not persist cookies between requests and most do
   not execute JavaScript. A crawler that hit this gate would loop on it and
   only ever see the 745-byte challenge page instead of my content. Today it
   only appears on attack-probe paths, not on real pages. My question is
   whether its scope was wider in late July.

3. Your own status updates describe rolling Imunify360 out to successive focus
   groups of shared servers through July and August 2026, and note that
   accounts with atypical traffic patterns may be presented with a challenge.
   My traffic loss falls inside that rollout window.

Could you please:

a) Confirm whether Imunify360, or any other WAF or bot-protection layer, was
   enabled or changed on the server hosting johnb.io on or around 28-29 July
   2026. Please give me the specific date and time of any such change.

b) Whitelist verified search engine and AI crawlers so they are never served
   the JavaScript challenge. Specifically:
       Googlebot
       Google-InspectionTool
       Bingbot
       GPTBot
       ClaudeBot
       PerplexityBot
       CCBot
   These all publish verifiable IP ranges or support reverse-DNS verification,
   so they can be allowed without weakening protection against real attacks.

c) Confirm whether any of my traffic was challenged, rate limited or blocked
   between 28 July and today, and if so roughly what volume.

d) Tell me whether I can see and manage the Imunify360 settings myself from
   cPanel on this plan, so I can check this without opening a ticket next time.

The site itself is a static HTML site with no CMS and no login, so there is no
legitimate reason for search engine traffic to be treated as suspicious.

Thank you,
John Bowman
johnb.io

---

## Before you send: run the one test that confirms it

Google Search Console → **URL Inspection** → paste `https://johnb.io/` →
**Test Live URL** → **View Tested Page** → **HTML** tab.

- If the HTML shows "Checking your browser…" instead of the homepage, the WAF
  is the cause. Send the ticket, and include that screenshot in it.
- If it shows the real homepage, the gate is not firing for Google right now.
  Still send the ticket to get the answer to question (a) — the gate may have
  fired in late July and since been relaxed, which would explain a cliff that
  has partly recovered.

## Also check while you are in Search Console

1. **Settings → Crawl stats** — look for a spike in 5xx or "other client error"
   responses starting 29 July. Note that a separate, real bug on my side was
   also generating 5xx for every missing file inside a subdirectory; that is
   fixed in this same batch of changes, so expect this number to fall.
2. **Security & Manual actions → Manual actions** — takes thirty seconds and
   rules out a human reviewer penalty completely.
3. **Pages → Why pages aren't indexed** — check for a jump in "Soft 404" or
   "Crawled - currently not indexed" dated late July.
4. Re-submit `https://johnb.io/sitemap.xml` once the WAF answer comes back.
