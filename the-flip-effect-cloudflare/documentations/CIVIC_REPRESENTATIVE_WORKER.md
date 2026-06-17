# 🛡️ Civic Representative Worker

> Cloudflare Worker proxy for the homepage `Find Your Representatives` search.
> This is the backend that the Vue frontend calls instead of hitting civic data APIs directly.

---

## 🎯 Purpose

The representative lookup pulls from **three data sources**. Doing that from the browser means:

- The Open States API key ships inside the client bundle (exposed to everyone).
- The browser becomes a mini-backend: geocode, fetch three schemas, match, filter, normalize.
- No real caching is possible, so every search burns live API quota.

This Worker fixes all three. The browser makes **one** call to the Worker. The Worker holds the key, calls the three sources server-side, caches the data, and returns one clean, normalized list.

```
browser → VITE_CIVIC_WORKER_URL (this Worker) → [Census + Congress + Open States]
                                                  ↑ Open States key lives here only
```

---

## 🧩 The Three Data Sources

There are **3 sources** but only **1 secret key**.

| Source | What it gives | Key? |
|--------|---------------|------|
| `unitedstates/congress-legislators` | Federal House + Senate reps (one static JSON blob) | No |
| `unitedstates/images` | Federal headshots by `bioguideId` | No |
| U.S. Census Geocoder | Address/ZIP → state + congressional district | No |
| Open States / Plural | State-house + state-senate legislators + photos | **Yes** |

> The Congress data + Congress images are the same project (two URLs), so this is commonly described as "3 sources." Only Open States requires a secret.

### Why not one API?

There is **no free single API** that returns federal **and** state legislators with photos:

- **Google Civic Representatives endpoint** was turned down April 30 2025 (only `divisionByAddress` / OCD-IDs remain — no rep data).
- **5 Calls API** is the closest single source, but its **state legislatures are currently unavailable** (federal + governors/SoS/AG only), and its per-location matching is not pre-cacheable.
- **Cicero** is paid. **Open States** is state-only.

The static-dataset approach (congress-legislators JSON + Census + Open States) is intentionally kept because it is **more cacheable** than any per-address single API.

---

## 🔑 Secrets & Env Split

The frontend `.env` should keep **only** the public Worker URL:

```env
VITE_CIVIC_WORKER_URL=https://civic-reps.<you>.workers.dev
```

That URL is safe to publish in the bundle (it is a URL, not a secret — same idea as a Stripe publishable key).

Everything else moves server-side into the Worker:

- The 3 source URLs → Worker config / `wrangler.toml` vars.
- The Open States key → a **Worker secret**, never a `VITE_` var:

```bash
wrangler secret put OPEN_STATES_API_KEY
```

---

## ⚡ Request Contract

The frontend sends one POST:

```ts
// frontend
const res = await ky.post(GlobalEnvs.CivicWorkerUrl, {
	json: { query, filters },
});
```

The Worker returns the already-normalized app shape:

```ts
{
	success: boolean;
	statusCode: number;
	message: string;
	civicRepresentatives?: {
		representatives: Array<CivicRepresentativeRecord>; // source: 'federal' | 'state'
		location?: CensusRepresentativeLocation;
	};
}
```

All geocoding, schema mapping, matching, and merging happen inside the Worker via `Promise.all` over the three sources. The browser never sees a raw third-party schema.

---

## 🗄️ Caching Strategy

Representatives are stable between elections, so the data is cached and refreshed on a schedule rather than fetched live per search.

- **Federal:** `congress-legislators` is already one static JSON blob → cache in KV, refresh weekly. Federal lookups drop to ~1 fetch/week total.
- **State:** cache Open States results per state in KV. Warming all 50 states = 50 requests; a weekly refresh = ~50 requests/week — far under the **560/day** limit.
- **Geocode:** Census is keyless; cache by ZIP/address when useful.
- **Cron:** a weekly Cloudflare Cron Trigger refreshes the cache. Post-midterms this means roughly ~10 requests/week against the keyed source.

Net effect: even abusive traffic is served from cache and almost never touches Open States, so quota exhaustion is a non-issue.

---

## 🔒 Endpoint Protection

Cloudflare protects the **key** automatically (Worker secret). It does **not** automatically protect the **endpoint** — the Worker URL is callable by anyone until locked down. Add:

1. **CORS allowlist** — only answer requests with `Origin` matching the app domain.
2. **Rate limiting** — Cloudflare rate-limit rules, or in-Worker per-IP limiting via KV.
3. **Cache as the backstop** — cached responses absorb load so the keyed source stays safe.
4. Optional: a shared header token or Cloudflare Turnstile for stronger bot defense.

---

## 🧠 Architecture Notes

- Keep raw third-party response shapes private inside the Worker.
- Return the flattened app-facing shape so the frontend only renders `representatives[]`.
- Keep federal and state results in one `representatives` array with `source: 'federal' | 'state'`.
- The frontend keeps `RepresentativePlaceholder` for any rep whose `photoUrl` is missing or fails to load.

---

_Last updated: JUN-14-2026 (`Civic Representative Worker Architecture`)_
