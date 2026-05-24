# i love claude code

A single-page Next.js site that asks one question — **Do you love Claude Code?** — with one button and a live globe of every person on Earth who said yes.

Live at **[iloveclaudecode.com](https://iloveclaudecode.com)**.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- [Upstash Redis](https://upstash.com) — counter, geo points, recent cities
- [Upstash Ratelimit](https://github.com/upstash/ratelimit) — IP-based abuse prevention
- [cobe](https://github.com/shuding/cobe) — 5 kB WebGL globe
- [motion](https://motion.dev) + [canvas-confetti](https://github.com/catdad/canvas-confetti)

## Local dev

```bash
bun install
cp .env.example .env.local
# paste your Upstash creds into .env.local
bun run dev
```

Open <http://localhost:3000>.

## Environment

| Variable                    | Where to find it                                                              |
| --------------------------- | ----------------------------------------------------------------------------- |
| `UPSTASH_REDIS_REST_URL`    | Upstash console → your database → REST API                                    |
| `UPSTASH_REDIS_REST_TOKEN`  | Same panel — copy the **read+write** token                                    |

## How counting works

- On first visit, the server sets a `iclc_id` cookie containing a UUID v4 (httpOnly, 10-year expiry).
- Clicking **Yes** posts to `/api/love`. The route does `SET NX love:voted:{voterId}` — Redis only sets the key if it didn't exist, returning `"OK"` for new voters and `null` for repeat clicks.
- Only on a new vote do we `INCR love:count` and `LPUSH` the geo point + city into capped lists.
- A sliding-window ratelimit (5 first-votes per IP per hour) blocks the obvious abuse path of clearing cookies in a loop.

Result: one vote per cookie, ever. Clearing cookies in a different browser still gets you another vote — that's fine. It's a vibe site, not Twitter.

## Redis keys

| Key                          | Type | Notes                                       |
| ---------------------------- | ---- | ------------------------------------------- |
| `love:count`                 | int  | total unique-voter count                    |
| `love:voted:{voterId}`       | str  | sentinel for `SET NX` uniqueness check      |
| `love:points`                | list | last 500 `{lat,lng,city,country,ts}` points |
| `love:cities`                | list | last 30 `"City, CC"` strings for the ticker |
| `ratelimit:love:{ip}`        | -    | managed by `@upstash/ratelimit`             |

To reset everything:

```bash
# in the Upstash console CLI tab
DEL love:count love:points love:cities
# voter sentinels expire never — DEL by pattern if you ever want to allow re-voting
```

## Deploy to Vercel

```bash
vercel link
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel --prod
```

Then in the Vercel dashboard:

1. **Project → Domains → Add `iloveclaudecode.com`**.
2. Follow the prompts to point your registrar's DNS at Vercel (A record `76.76.21.21` or CNAME to `cname.vercel-dns.com`).
3. Wait for the cert to issue — usually under a minute.

The `/api/love` route runs on the edge runtime, so it colocates with the user and Upstash's REST API.

## License

MIT.
