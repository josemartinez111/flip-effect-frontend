# 🗒️ Cloudflare Worker Notes — What's Going On & Why

> Running knowledge file for this Worker project. Append to it as decisions are made.
> Goal: capture the *why* (secrets, git boundary, env split, data sources) so this can later be
> lifted into the Vite/Vue scaffolding template as a reusable Cloudflare add-on.
> Architecture-specific detail (proxy/cache) lives in `CIVIC_REPRESENTATIVE_WORKER.md`.

---

## 📡 Data Sources — 3 Keyless + 1 Keyed

The rep search pulls from four places. Only **one** needs a secret.

| Source | URL | Key? | What it gives |
|--------|-----|------|---------------|
| Congress legislators | `unitedstates.github.io/congress-legislators/legislators-current.json` | ❌ none | Federal reps + senators (static JSON on GitHub Pages) |
| Congress photos | `unitedstates.github.io/images/congress/225x275/<bioguide>.jpg` | ❌ none | Federal headshots (GitHub Pages) |
| U.S. Census geocoder | `geocoding.geo.census.gov/.../onelineaddress` | ❌ none | Address → state + district (gov public API) |
| Open States v3 | `v3.openstates.org` | ✅ **key** | State legislators (the only rate-limited, keyed source) |

**Takeaway:** 3 of 4 are free, keyless, public. The Worker exists mainly to (a) hide the **one** Open States key and (b) collapse the multi-call gymnastics the browser was doing.

---

## 🔐 Secrets — Where The Key Lives

The Worker reads the key as `env.OPEN_STATES_API_KEY`. That single name is fed by **two separate stores**, manually, once each. They do **not** sync.

| Environment | Value comes from | Lives where | Ships in bundle? |
|-------------|------------------|-------------|------------------|
| Local `wrangler dev` | `.dev.vars` file (you paste it) | your disk only | ❌ never |
| Production worker | `wrangler secret put` **or** CF dashboard (you paste it) | Cloudflare encrypted secret store | ❌ never |

### Setting / updating the production secret (three equal ways)
1. **CLI:** `pm secret:worker` → `wrangler secret put OPEN_STATES_API_KEY` → prompts, you paste the value.
2. **Dashboard UI:** Workers & Pages → `the-flip-effect-worker` → Settings → Variables and Secrets → add/edit/delete. No redeploy needed; runtime picks up the new value.
3. **Pipe (optional):** `echo "$KEY" | wrangler secret put OPEN_STATES_API_KEY`.

**`wrangler secret put` does NOT read `.dev.vars`.** The value is whatever you paste at the prompt. `.dev.vars` is local-only and never travels to Cloudflare.

### Why the file is named `.dev.vars` (not `.vars`)
- It's a **reserved wrangler filename**. Only a file named exactly `.dev.vars` is auto-loaded — and only by `wrangler dev`.
- `.dev` = local development; `.vars` = the variables. Rename it and wrangler ignores it.
- The committed `.dev.vars.example` is just a placeholder template; copy it to `.dev.vars` and fill the real key (which stays gitignored).

---

## 🧩 The Three "Env" Channels (don't confuse them)

| Channel | File / Store | Public or Secret | Committed? |
|---------|--------------|------------------|------------|
| Public config vars | `wrangler.jsonc` → `"vars"` (URLs) | Public | ✅ yes |
| TypeScript binding types | `api/worker-env.ts` (`WorkerEnv`) | Types only, no values | ✅ yes |
| Local secret | `.dev.vars` | Secret | ❌ gitignored |
| Production secret | Cloudflare secret store (`secret put` / UI) | Secret | n/a (not a file) |

- `worker-env.ts` declares the *shape* (`OPEN_STATES_API_KEY: string`) so strict TS knows it exists — but holds **no value**.
- Public URLs (congress, census, open states base) are non-secret, so they live in `wrangler.jsonc` `"vars"` and are committed.

---

## 🌳 Git Boundary — Where `.git` Lives

There is **one** git repo, at the frontend root:

```
flip-effect-frontend/                 ← .git lives HERE (single repo)
├── src/ ...
└── the-flip-effect-cloudflare/       ← Worker, NESTED inside that repo
    └── .gitignore  (ignores node_modules/, .wrangler/, .dev.vars, logs, dist)
```

- The Worker folder is currently **untracked but not ignored**, so a normal `git add` + commit **will include it in the frontend GitHub repo**.
- The nested `.gitignore` only hides build/secret artifacts (`node_modules/`, `.wrangler/`, `.dev.vars`) — **the source files are still tracked** by the root repo.

### Decision: it's fine to land on GitHub
- **No secret is ever in a tracked file.** The key only exists in `.dev.vars` (gitignored) and the CF secret store. So committing the Worker source leaks nothing.
- The Worker's protection is the **secret + same-domain route + rate limiting**, not hiding the source code.
- The only hard rule: **never `git add` `.dev.vars`** and **never paste the real key** into `wrangler.jsonc`, docs, or source.

### Alternative (if you ever want clean separation)
`git init` inside `the-flip-effect-cloudflare/` and add it to the root `.gitignore`, giving the Worker its own history / its own GitHub repo. Not done — kept in the frontend repo for simplicity.

---

## 🧭 First-Time Setup — Run Order (do once)

Worker code is written, but nothing is live until CF resources exist. Run these **in order** before the frontend can call it.

| # | Step | Command | Why |
|---|------|---------|-----|
| 1 | Auth wrangler | `npx wrangler login` | One-time browser login to your CF account |
| 2 | Create KV namespace | `pm create:cache` | Outputs an id — paste it into `wrangler.jsonc` (replaces `REPLACE_WITH_KV_NAMESPACE_ID`). Cache is dead without it |
| 3 | Set production secret | `pm secret:worker` | Paste Open States key → CF secret store |
| 4 | Local secret for dev | copy `.dev.vars.example` → `.dev.vars`, fill key | Lets `wrangler dev` hit Open States locally |

**Then pick a path:**
- **Local test:** `pm run:worker` → `localhost:8787`. Point frontend `VITE_CIVIC_WORKER_URL` at it, verify before deploy.
- **Live:** `pm deploy:worker` → `theflipeffect.us/api/*` responds. Requires `theflipeffect.us` to already be a zone/route in your CF account.

**Only after the worker responds** does the frontend rewire (collapse `fetchCivicRepresentativesAction` to one POST) make sense.

---

## 👀 What You'll See on the Cloudflare Dashboard

All at [dash.cloudflare.com](https://dash.cloudflare.com). Things appear in this order — **the KV namespace shows up after step 2 above; the Worker itself only shows up after you deploy.**

| Order | What | Where to click | When it appears |
|-------|------|----------------|-----------------|
| 1 | KV namespace `the-flip-effect-representatives-cache` | **Storage & Databases → KV** | After `pm create:cache`. Visible **now** |
| 2 | The Worker `the-flip-effect-worker` | **Compute (Workers) → Workers & Pages** | Only after `pm deploy:worker`. **Not** there during local `wrangler dev` |
| 3 | Public vars + secret `OPEN_STATES_API_KEY` (shown as hidden) | Worker → **Settings → Variables and Secrets** | After deploy |
| 4 | Weekly cron `0 9 * * 1` + route `theflipeffect.us/api/*` | Worker → **Settings → Triggers** | After deploy |

**Two gotchas:**
- **Local dev does not touch the dashboard KV.** `wrangler dev` uses a *local* simulated KV (the output says `Mode: local`). So the dashboard namespace stays at **0 keys** until a **deployed** worker's cron seeds it (or you write to it remotely). Empty there during local testing is normal.
- **The Worker is invisible on the dashboard until the first `pm deploy:worker`.** Running locally proves the code works but ships nothing to CF.

---

## 🚀 Deployment — Code vs Secret

- `wrangler deploy` ships **only the code** (the `api/` bundle). It does **not** carry `.dev.vars` or any secret.
- At runtime Cloudflare **injects** the secret from its store into `env.OPEN_STATES_API_KEY`. The code reads `env.X` and never has the literal value baked in.
- Updating the key later (CLI or UI) takes effect at runtime — **no redeploy required**.

---

## ♻️ Porting Into The Vue/Vite Scaffold (Future)

When folding this into the scaffolding template, the reusable, project-agnostic pieces are:
- The folder shape: `api/{endpoints,services,data-providers,<domain>-cache,shared}` + `worker-env.ts`.
- The secret pattern: `wrangler.jsonc` public `vars` vs `.dev.vars` local secret vs CF secret store.
- The script naming (`run:worker`, `build:worker`, `deploy:worker`, `create:cache`, `secret:worker`, …).
- The `.dev.vars.example` template + nested `.gitignore`.
- One `export default` only in `server.ts` (the worker entry); everything else `export const`.

Project-specific (swap per app): the data sources table, the cache keys.

---

_Append new sections below as decisions land. Keep the "why" — that's the part that's hard to recover later._
