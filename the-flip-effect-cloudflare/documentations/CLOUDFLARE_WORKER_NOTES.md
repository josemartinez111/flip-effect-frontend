# 🗒️ Cloudflare Worker Notes — What's Going On & Why

> Running knowledge file for this Worker project. Append to it as decisions are made.
> Goal: capture the *why* (secrets, git boundary, env split, data sources) so this can later be
> lifted into the Vite/Vue scaffolding template as a reusable Cloudflare add-on.
> Architecture-specific detail (proxy/cache) lives in `CIVIC_REPRESENTATIVE_WORKER.md`.

---

## 🧱 Folder Shape — Module-Based Vertical Slices (and why)

The Worker mirrors the .NET Minimal-API **module** backend (the `Modules/` folder with `AuthModule`, `BaseModule`, `HealthCheckModule`, `SharedModule`). Each worker module is a `-module/` folder under `app/api-modules/`. Feature modules carry the full vertical slice; `shared-module/` and the health module stay flatter (only what they need), exactly like `SharedModule` / `HealthCheckModule` in .NET.

```
the-flip-effect-cloudflare/
├── app/
│   ├── app.ts                          # composition root (Program.cs analog) — the ONLY export default; CORS + app.route mounts
│   ├── server.ts                       # the "server": Hono app + logger + onError + scheduled cron handler
│   └── api-modules/                    # ≈ .NET Modules/
│       ├── representatives-module/      # a feature module = one full vertical slice
│       │   ├── presentation/           # representativesEndpoint.ts   (Endpoints class + mapped routes)
│       │   ├── application/            # representativesService.ts    (orchestration)
│       │   ├── infrastructure/         # civicDataProviders.ts + representativesCache.ts (I/O: upstreams + KV)
│       │   └── domain/                 # representativeModel.ts + civicUpstreamModel.ts + representativeConstants.ts
│       ├── health-check-module/        # ≈ HealthCheckModule — flattened, presentation only
│       │   └── presentation/           # healthCheckEndpoint.ts       (GET /api/health-check smoke route)
│       └── shared-module/              # ≈ SharedModule — flat, no slice layers
│           ├── worker-env.ts           # WorkerEnv + WorkerHonoEnv ({ Bindings: WorkerEnv })
│           ├── httpStatus.ts           # STATUS const + HttpStatus union — cross-cutting, reusable in any worker
│           ├── apiTryCatchTypes.ts     # AsyncAPIActionParams + status-coded Results contract
│           └── utils.ts                # Utils.APITryCatch behavior
├── test/                               # vitest + @cloudflare/vitest-pool-workers; mirrors the module tree
│   └── health-check-module/            # healthCheck.test.ts — the default scaffold smoke test
├── documentations/
├── vitest.config.ts                    # cloudflareTest plugin → wrangler.toml + path-alias re-declares
├── wrangler.toml                      # main → app/app.ts
└── tsconfig.json                       # paths aliases, no baseUrl
```

**Why this shape:**

| Layer | .NET analog | Holds | Why separate |
|-------|-------------|-------|--------------|
| `app/app.ts` | `Program.cs` (`public partial class Program`) | the one `export default` worker object + CORS allowlist + `app.route` mounts | Cloudflare's dated rule demands `export default {}`. Quarantine it to one entry file; everything else is plain `export const` and unit-callable. |
| `app/server.ts` | wiring section of `Program.cs` | Hono `app` + `logger` + `onError` + `scheduled` | "the server" — the Hono instance and request/cron surface. `app.ts` composes it (CORS + routes), so the entry stays a thin wiring file. |
| `app/api-modules/` | `Modules/` | every `-module/` folder | The module bag. `app.ts`/`server.ts` import **downward** into modules; a module never imports back up into `app/`. |
| `presentation/` | `Presentation/*Endpoints.cs` | `*Endpoints` class with static `mapped*Routes()` + private static handlers | HTTP shape only, no business logic. The completed route group is mounted in `app.ts`. |
| `application/` | `Application/Services/` | validate → fan out → normalize | The brain. Knows nothing about HTTP or KV mechanics. |
| `infrastructure/` | `Infrastructure/` | upstream fetches + KV cache | All I/O. Swappable without touching the brain. |
| `domain/` | `Domain/{Entities,DTOs}` | `*Model.ts` types + `*Constants.ts` | The contract. Imported everywhere, depends on nothing. Models take a `Model` postfix; both app-facing and upstream DTO models live here. |
| `health-check-module/` | `HealthCheckModule` | `presentation/healthCheckEndpoint.ts` only | Flattened — a smoke route needs no application/domain/infra. The always-there default test target after scaffolding. |
| `shared-module/` | `SharedModule` | `WorkerEnv` / `WorkerHonoEnv`, `STATUS` / `HttpStatus`, `AsyncAPIActionParams` / `Results`, `Utils.APITryCatch` | Cross-cutting, feature-agnostic — the genuinely reusable bits for the scaffold. Flat, no slice layers. |

**No barrels.** An API project has no external consumers to shield, so a barrel only hides the real source file and invites circular imports. Import the exact file via aliases (`@representatives-module/application/representativesService`). Same reasoning the frontend `CLAUDE.md` already applies to pages/composables — it bites harder in a backend.

**Path aliases (`tsconfig.json` `paths`):** `@app/*` → `app/*`, `@representatives-module/*` → `app/api-modules/representatives-module/*`, `@health-check-module/*` → `app/api-modules/health-check-module/*`, `@shared-module/*` → `app/api-modules/shared-module/*`. One alias per module, 1:1 with the folder name. `vitest.config.ts` re-declares the same set as `resolve.alias` (Vite ignores tsconfig `paths`).

**Adding a feature module later:** drop `app/api-modules/<newName>-module/{presentation,application,infrastructure,domain}`, add an `@<newName>-module/*` alias to `tsconfig.json` (and `vitest.config.ts`), return its route group from `YourEndpoints.mappedYourRoutes()`, and mount it in `app/app.ts` with `app.route('/api', YourEndpoints.mappedYourRoutes())`. `shared-module/`, `health-check-module/`, and `server.ts` don't change.

---

## 🪢 Hono — Why & How (the framework layer)

The Worker runs on **Hono**. The old hand-rolled `ts-pattern` router + manual CORS string-matching are gone. What Hono buys us:

| Gain | Old (hand-rolled) | New (Hono) |
|------|-------------------|------------|
| Routing | one big `match(pathname)` in `server.ts` | `RepresentativesEndpoints.mappedRepresentativesRoutes()` returns the group mounted by `app.route()` |
| CORS | manual `Origin` header echo + `OPTIONS` branch | `hono/cors` allowlist middleware on `/api/*` |
| Logging | none | `hono/logger` (method, path, status, timing) |
| Errors | per-handler try/catch only | `app.onError` central 500 net + per-handler guards |
| Testing | spin a real request | `app.request('/api/...')` in-process, or `SELF.fetch()` through real workerd (see Testing below) |

**Typing rules we hold (Hono "takes liberties" otherwise):**
- Generics everywhere: `new Hono<WorkerHonoEnv>()`, `Context<WorkerHonoEnv>`. `WorkerHonoEnv = { Bindings: WorkerEnv }` lives in `shared-module/worker-env.ts` so `ctx.env` is fully typed.
- Context is **`ctx`**, not `c`.
- **Class-own handlers, never inline** — `YourEndpoints.mappedYourRoutes()` passes a private static handler directly to `routeGroup.post('/path', YourEndpoints.fetchThingAsync)`.
- **Status codes:** Hono ships only **types** (`StatusCode` / `ContentfulStatusCode` from `hono/utils/http-status`), no value enum. So `shared-module/httpStatus.ts` keeps the `STATUS` const; its `HttpStatus` union (`200 | 400 | 404 | 500 | 503`) is a subset of `ContentfulStatusCode`, so `ctx.json(body, result.statusCode)` type-checks with **no casts**.

**Entry split with Hono:** `server.ts` builds `app`, attaches `logger` + `onError`, exports `app` and `scheduled` as `export const`. `app.ts` imports them, attaches the CORS allowlist on `/api/*`, mounts route groups, and is the only `export default` (`{ fetch: app.fetch, scheduled }`). `wrangler.toml` `main` → `app/app.ts`.

---

## 🧪 Testing — `vitest` + `@cloudflare/vitest-pool-workers`

Tests run **inside the real `workerd` runtime**, not Node — so `env` bindings (KV, vars from `wrangler.toml`) are real, not mocked.

| Piece | What | Why |
|-------|------|-----|
| `vitest.config.ts` | `cloudflareTest({ wrangler: { configPath: './wrangler.toml' } })` plugin + `resolve.alias` | Boots workerd with the same bindings the worker ships with. Vite ignores tsconfig `paths`, so the module aliases are re-declared as `resolve.alias` or the bundled worker can't resolve its own imports. |
| `tsconfig.json` `types` | `@cloudflare/vitest-pool-workers/types` | Provides the `cloudflare:test` module declarations (`SELF`, `env`, …). Note the `/types` subpath — the bare package name doesn't expose them. |
| `SELF.fetch(...)` | imported from `cloudflare:test` | Drives the **whole** worker end to end (through `app.ts`, CORS, routing). The default `health-check-module` test asserts `GET /api/health-check` → 200 and `?fail=true` → 503. |
| `pm test:worker` | `vitest run` (one-shot); `pm test:watch:worker` for watch | A green run after scaffolding proves Hono + routing + bindings are all wired before you write a real module. |

**API note (pinned to current `@cloudflare/vitest-pool-workers` 0.16 / vitest 4):** the old `defineWorkersConfig` from `@cloudflare/vitest-pool-workers/config` is **gone**. Use the `cloudflareTest` **plugin** from `@cloudflare/vitest-pool-workers` inside a normal `defineConfig` from `vitest/config`. (The package ships a `vitest-v3-to-v4` codemod for the migration.)

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
| Public config vars | `wrangler.toml` → `"vars"` (URLs) | Public | ✅ yes |
| TypeScript binding types | `shared-module/worker-env.ts` (`WorkerEnv`) | Types only, no values | ✅ yes |
| Local secret | `.dev.vars` | Secret | ❌ gitignored |
| Production secret | Cloudflare secret store (`secret put` / UI) | Secret | n/a (not a file) |

- `worker-env.ts` declares the *shape* (`OPEN_STATES_API_KEY: string`) so strict TS knows it exists — but holds **no value**.
- Public URLs (congress, census, open states base) are non-secret, so they live in `wrangler.toml` `"vars"` and are committed.

### `.dev.vars` vs `wrangler.toml` at a glance

| | `.dev.vars` | `wrangler.toml` |
|---|---|---|
| Holds | **Secrets** (`OPEN_STATES_API_KEY`) | **Public config**: source URLs, KV namespace id, route, cron, worker name |
| Read by | `wrangler dev` only (local) | `wrangler dev` **and** `wrangler deploy` (the deploy manifest) |
| Committed? | ❌ **gitignored** | ✅ **committed — must be** |
| If it leaked | Bad — it's the actual key | Harmless — it's just endpoints + a resource id |

### Should `wrangler.toml` be gitignored too? **No.**
- It contains **zero secrets** — only public URLs, the KV namespace **id**, the route, and the cron. The KV id is just a resource identifier; it does nothing without auth into *your* Cloudflare account.
- It's the Worker's **deploy manifest**. Ignore it and a fresh clone (or you on a new machine) can't build or deploy the Worker — no bindings, no route, no cron.
- Rule of thumb: **secrets → `.dev.vars` (ignored); everything needed to *build/deploy* → `wrangler.toml` (committed).** The split is intentional, not an oversight.

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
- The only hard rule: **never `git add` `.dev.vars`** and **never paste the real key** into `wrangler.toml`, docs, or source.

### Alternative (if you ever want clean separation)
`git init` inside `the-flip-effect-cloudflare/` and add it to the root `.gitignore`, giving the Worker its own history / its own GitHub repo. Not done — kept in the frontend repo for simplicity.

---

## 🧭 First-Time Setup — Run Order (do once)

Worker code is written, but nothing is live until the CF resources exist **and the secret is set**. Run these **in order** from `the-flip-effect-cloudflare/` (use `npx wrangler …`; there's no global wrangler — it's a project devDependency on purpose).

| # | Step | Command | Why |
|---|------|---------|-----|
| 1 | Auth wrangler | `npx wrangler login` | One-time browser login to your CF account |
| 2 | Confirm / create the KV | `npx wrangler kv namespace list` (or `pm create:cache` if missing) | The `id` in `wrangler.toml` must exist on **your** account or `deploy` fails |
| 3 | Local secret for dev | copy `.dev.vars.example` → `.dev.vars`, fill the Open States key | Lets `wrangler dev` hit Open States locally |
| 4 | Deploy | `pm deploy:worker` | Ships to **`<worker>.<sub>.workers.dev`** — the custom-domain `[[routes]]` block is **commented out in `wrangler.toml`** until `theflipeffect.us` joins Cloudflare (`workers_dev = true` gives the free URL meanwhile) |
| 5 | **Set the production secret** | `pm secret:worker` → paste the Open States key | **Required for State Lawmakers.** `secret put` also bumps the version (a redeploy). Persists across all future deploys — **one-time** |

> 🟥 **The gotcha that will bite you (it bit us):** `wrangler deploy` ships **code only — never `.dev.vars`**. Until step 5 runs on the live worker, **US Congress works** (keyless `congress-legislators` GitHub blob) but **State Lawmakers returns `"State representative lookup is unavailable right now."`** — Open States needs the key. They are **different APIs**; one working while the other doesn't is the *expected* symptom of a missing secret, **not a bug**. Set the secret, retry.

**Then point the frontend (`VITE_CIVIC_WORKER_URL`) at it — pick one:**
- **Live worker (no local process):** `https://<worker>.<sub>.workers.dev`, restart `pm dev`. CORS already allowlists `localhost:5173`.
- **Local worker:** `pm run:worker` → `http://localhost:8787` (a *local* simulated KV; dashboard KV stays empty).
- **Production (July):** when `theflipeffect.us` is a Cloudflare zone, uncomment the `[[routes]]` block, drop `workers_dev`, redeploy.

---

## 👀 What You'll See on the Cloudflare Dashboard

All at [dash.cloudflare.com](https://dash.cloudflare.com). Things appear in this order — **the KV namespace shows up after step 2 above; the Worker itself only shows up after you deploy.**

| Order | What | Where to click | When it appears |
|-------|------|----------------|-----------------|
| 1 | KV namespace `the-flip-effect-representatives-cache` | **Storage & Databases → KV** | After `pm create:cache`. Visible **now** |
| 2 | The Worker `the-flip-effect-worker` (URL `<worker>.<sub>.workers.dev`) | **Compute (Workers) → Workers & Pages** | Only after `pm deploy:worker`. **Not** there during local `wrangler dev` |
| 3 | Public vars + secret `OPEN_STATES_API_KEY` (shown as hidden) | Worker → **Settings → Variables and Secrets** | After deploy **+ `pm secret:worker`** — the secret is its own step |
| 4 | Weekly cron `0 9 * * 1` (custom route stays commented out until the domain move) | Worker → **Settings → Triggers** | After deploy |

**Two gotchas:**
- **Local dev does not touch the dashboard KV.** `wrangler dev` uses a *local* simulated KV (the output says `Mode: local`). So the dashboard namespace stays at **0 keys** until a **deployed** worker's cron seeds it (or you write to it remotely). Empty there during local testing is normal.
- **The Worker is invisible on the dashboard until the first `pm deploy:worker`.** Running locally proves the code works but ships nothing to CF.

---

## 🚀 Deployment — Code vs Secret

- `wrangler deploy` ships **only the code** (the `api/` bundle). It does **not** carry `.dev.vars` or any secret.
- At runtime Cloudflare **injects** the secret from its store into `env.OPEN_STATES_API_KEY`. The code reads `env.X` and never has the literal value baked in.
- Updating the key later (CLI or UI) takes effect at runtime — **no redeploy required**.

---

## 🌱 Cache Seeding — Weekly Cron + Seed-on-Deploy

The KV cache fills two ways, both running the same `seedAllStates` (federal blob + every state roster):

1. **Weekly cron** (`0 9 * * 1`, the `scheduled` handler) — the time-based refresh.
2. **Seed-on-new-version** — the `[version_metadata]` binding (`CF_VERSION_METADATA`) exposes the Worker's deploy version id at runtime. A request middleware (`application/representativesSeedOnDeploy.ts`) compares it to a KV marker `meta:seeded-version`; on a **new version (every deploy) or an unseeded cache**, the first request claims the version and fires `seedAllStates` inside `ctx.waitUntil` (background — never blocks the response). So **every deploy = a fresh cache**, no manual trigger, no deploy-script curl.

**Quota guard (so frequent deploys don't blow Open States' ~560/day):** `seedAllStates` does one `KV.list()` and **skips any roster refreshed within `SEED_FRESHNESS_WINDOW_MS` (6 days)** — a `metadata.seededAt` stamped on every `put`. Repeat deploys the same day therefore re-fetch ~nothing. The window is `< CACHE_TTL_SECONDS` (1 week) so the weekly cron still refreshes everything.

**Still needs the secret:** the state half of the seed calls Open States, so without `OPEN_STATES_API_KEY` on the live worker (Setup step 5) only `federal:legislators` seeds. KV keys you'll see after a seeded deploy: `federal:legislators`, `state:CA`, `state:FL`, …, `meta:seeded-version`.

---

## ♻️ Porting Into The Vue/Vite Scaffold (Future)

When folding this into the scaffolding template, the reusable, project-agnostic pieces are:
- **Hono as the framework:** `new Hono<WorkerHonoEnv>()` + `hono/logger` + `hono/cors` allowlist + `app.onError`. Each `*Endpoints` class owns its static `mapped*Routes()` method and private static handlers; `app.ts` mounts the completed route groups.
- The module-based folder shape: `app/{app,server}` + `app/api-modules/<name>-module/{presentation,application,infrastructure,domain}` + `app/api-modules/shared-module/{worker-env,httpStatus,apiTryCatchTypes,utils}`. Models take a `Model` postfix; feature modules carry the full slice, `shared-module/` stays flat.
- `shared-module/httpStatus.ts` (`STATUS` const + `HttpStatus` union), `shared-module/worker-env.ts` (`WorkerEnv` + `WorkerHonoEnv`), `shared-module/apiTryCatchTypes.ts` (try/catch contracts), and `shared-module/utils.ts` (behavior) — fully feature-agnostic.
- **`health-check-module/` + its `test/health-check-module/healthCheck.test.ts`** — the always-there scaffold default. New project → `pm test:worker` → green proves the wiring before any real module is written.
- **The test stack:** `vitest` + `@cloudflare/vitest-pool-workers` (`cloudflareTest` plugin → `wrangler.toml`), `tsconfig` `types` includes `@cloudflare/vitest-pool-workers/types`, `vitest.config.ts` re-declares the module aliases as `resolve.alias`.
- The secret pattern: `wrangler.toml` public `vars` vs `.dev.vars` local secret vs CF secret store.
- The script naming (`run:worker`, `build:worker`, `deploy:worker`, `test:worker`, `create:cache`, `secret:worker`, …).
- The `.dev.vars.example` template + nested `.gitignore`.
- The entry split: `app/server.ts` exports `app` + `scheduled` (`export const`), `app/app.ts` is the only `export default` (composition root: CORS + `app.route` mounts). `wrangler.toml` `main` → `app/app.ts`. Everything else `export const`.
- The path aliases (`@app/*`, `@<name>-module/*`, `@shared-module/*` — one per module) in `tsconfig.json` `paths` **and** `vitest.config.ts` `resolve.alias` — no `baseUrl` (deprecated in TS 6; `moduleResolution: Bundler` resolves `paths` relative to the tsconfig, targets need a leading `./`).

Project-specific (swap per app): the feature module name + its route group + its alias, the data sources table, the cache keys. For the template, the `representatives-module` becomes a rename-ready placeholder module; `health-check-module` + `shared-module` ship as-is.

---

_Append new sections below as decisions land. Keep the "why" — that's the part that's hard to recover later._
