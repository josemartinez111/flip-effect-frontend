# 🎨 CLAUDE.md - AI Assistant Context & Instructions

> !!NOTE!! **"no code" rule — when active: ANSWER ALL USER QUESTIONS FIRST, then DO NOT generate or modify ANY code whatsoever. Wait for explicit user instruction before writing a single line. Questions always come before code.**
> !!NOTE!! **"ttm" means "talk to me" — treat it exactly like the no-code rule. Brainstorm, reason, and ask/answer questions only. Do not edit, create, delete, move, or generate code until the user explicitly releases the no-code/ttm constraint.**

> 🔥🔥🔥 !!!NEVER EVER WRITE, EDIT, CREATE, OR TOUCH ANY FILE OUTSIDE THE PROJECT DIRECTORY WITHOUT EXPLICIT USER PERMISSION!!! This includes `~/.config/`, `~/.claude/`, or ANY path outside the current project root. ASK FIRST. ALWAYS. NO EXCEPTIONS. 🔥🔥🔥

> 🔁 **Scaffold back-port (explicitly permitted on request):** The user may ask to port a breakthrough fix/pattern from this project back into the source scaffold at `/Users/josemartinez/Desktop/Business Fantum Wave Software/FantumWaveTech/vuejs-frontend-template` (code **and** its docs), to keep that template current for future projects. This is the one standing exception to the "no files outside the project root" rule above — but **only** when the user explicitly asks for that port in the current instruction. Mirror the change faithfully, update the template's docs too, typecheck it, and never delete/move template artifacts.

> ❗️❗️❗️ **NEVER delete or move existing files unless the user explicitly requests it.** Preserve every scaffolded artifact and historical document.
> **Audience:** claude-code | **Project:** Vue.js Frontend Template
> **Type:** Reusable scaffold for FantumWave Vue 3 projects
> **Stack:** Vue 3 + Vite + TypeScript + TailwindCSS v4 + PrimeVue + Pinia

---

## 🎯 What This Is

Shared briefing for AI coding agents. Summarizes architecture, workflow expectations, and coding conventions. Ensures every session respects contributor preferences and production constraints.

---

## 📦 Key Dependencies

**Core:** Vue 3.5, Vue Router 5, TypeScript 5.9, Vite 7
**State:** Pinia 3 (primary — Composition API / Setup Store style)
**UI:** TailwindCSS 4.0, PrimeVue 4, @headlessui/vue, @vueuse/motion
**Icons:** lucide-vue-next, primeicons
**Backend:** @supabase/supabase-js, axios, ky
**Docs:** jspdf, jspdf-autotable, docx, export-to-csv, file-saver
**Features:** @vueuse/head, @emailjs/browser, @tsparticles/vue3, qrcode.vue, vue-qrcode-reader
**Dev:** Prettier, prettier-plugin-tailwindcss, knip, rollup-plugin-visualizer, vite-plugin-image-optimizer

---

## 🏗️ Architecture Snapshot

```
vuejs-frontend-template/
├── src/
│   ├── api/                              # Backend integration layer
│   │   ├── actions/                      # API action classes
│   │   │   └── auth/                     # Supabase auth actions
│   │   ├── context/                      # Supabase client context
│   │   ├── types/                        # API-specific types
│   │   └── utils/                        # API helpers
│   │
│   ├── app/
│   │   └── App.vue                       # Root app component (in app/ subfolder)
│   │
│   ├── assets/                           # Static assets (SVGs, images)
│   │
│   ├── components/
│   │   ├── shared/                       # Reusable shared components
│   │   │   ├── buttons/                  # FloatingButton, etc.
│   │   │   ├── footer/                   # Footer.vue
│   │   │   ├── icons/                    # SVG icon components
│   │   │   ├── navbar/                   # NavBar, NavBrand, NavCTAButton,
│   │   │   │                             #   NavHamburger, SideDrawer,
│   │   │   │                             #   DarkmodeToggleSwitch
│   │   │   └── ribbon/                   # Ribbon.vue
│   │   ├── utils/                        # Generic utility components
│   │   │   ├── AppImage.vue              # Lazy-loading image wrapper
│   │   │   └── Show.vue                  # Conditional render helper
│   │   └── index.ts                      # Components barrel
│   │
│   ├── lib/
│   │   ├── constants/                    # App-wide constants
│   │   ├── global-composables-hooks/     # Shared composables (UseGradientComposable, etc.)
│   │   ├── stores/                       # Pinia stores (Use$Name$Store pattern)
│   │   ├── types/                        # ApiActionResult, AppTheme, etc.
│   │   ├── utils/                        # date-formatter, validation, etc.
│   │   └── index.ts                      # Lib barrel
│   │
│   ├── pages/                            # Route-based page components (.page.vue)
│   │   ├── home/
│   │   │   └── home.page.vue
│   │   ├── layouts/                      # Layout components (wrap RouterView once at root)
│   │   │   └── RootLayout.vue            # Default root layout (NavBar + RouterView + Footer)
│   │   └── index.ts                      # Pages barrel
│   │
│   ├── router/
│   │   ├── routes.ts                     # Vue Router config + navigation guards
│   │   └── UseNavLinksComposable.ts      # NavLinkType + navigation-link composable
│   │
│   ├── App.vue                           # Root entry (mounts router-view)
│   ├── main.ts                           # App bootstrap
│   └── style.css                         # Tailwind v4 design system + custom utilities
│
├── build-utils.ts                        # ImageTools, ImageOptimizer, MissionReport
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── public/
```

**Highlights:** Vue Router nested routes for opt-in layout inheritance, Supabase auth, Pinia for ALL state, native Vue lifecycle hooks, TailwindCSS v4, PrimeVue 4 (Aura), strict TypeScript.

---

## 🔗 Backend Integration

**Pattern:** Vue 3 + TypeScript → .NET 8 Minimal API + PostgreSQL (or Supabase direct)
**Auth:** Supabase (magic link, password reset)
**Privacy:** All POST requests with JSON body (no sensitive GET params)

> 🛠️ **The .NET API project for this frontend lives at** `/Users/josemartinez/Desktop/Business Fantum Wave Software/FantumWaveTech/FWTFullApps/FlipEffectEntireApp/TheFlipEffectAPI` — i.e. **beside** `flip-effect-frontend/` inside `FlipEffectEntireApp/` (its own solution + `.git`). This is the real backend going forward; the existing Cloudflare Workers are slated to be **migrated into actions** in this API project. It is **outside this project root** — the standing "no files outside the project root without permission" rule still applies to it.

### ☁️ Cloudflare (Workers / Proxies)

- **Everything Cloudflare-related lives in `the-flip-effect-cloudflare/`** at the repo root. Worker TypeScript code, `wrangler.toml`, and Cloudflare docs all belong there — not under `src/`.
- **Framework: Hono** (`new Hono<WorkerHonoEnv>()`). The hand-rolled `ts-pattern` router + manual CORS are gone. We get route grouping, `hono/logger`, `hono/cors` allowlist middleware, and `app.onError` real error handling.
- Worker source uses a **module-based vertical-slice layout** (mirrors the .NET `Modules/` backend — `AuthModule`/`BaseModule`/`HealthCheckModule`/`SharedModule`): `app/` (entry + server) holds `app/api-modules/` (≈ `Modules/`). Each module is a `-module/` folder. Feature modules carry the full slice — `app/api-modules/representatives-module/{presentation,application,infrastructure,domain}`; `shared-module/` (≈ `SharedModule`, flat: `worker-env.ts`, `httpStatus.ts`, `apiTryCatchTypes.ts`, `utils.ts`) and `health-check-module/` (≈ `HealthCheckModule`, flattened: `presentation/` only) stay lean. No barrels — import the exact file via per-module path aliases (`@app/*`, `@representatives-module/*`, `@health-check-module/*`, `@shared-module/*`). Add a new module → new `-module/` folder + its `@<name>-module/*` alias in `tsconfig.json` **and** `vitest.config.ts` `resolve.alias`. Imports flow downward only (`app/` → `api-modules/`, never reverse).
- **Class-based Worker APIs:** Application services and feature cache collaborators use exported classes with static methods. Presentation files export an `*Endpoints` class with a static `mapped*Routes()` method and private static handlers, so `app.ts` mounts a completed route group just like the .NET/Elysia composition root. Worker event exports remain at module scope because they are Cloudflare framework boundaries.
- **Models get a `Model` postfix** (`representativeModel.ts` = app-facing contract, `civicUpstreamModel.ts` = raw upstream DTOs). Both live in `domain/` (upstream DTOs are still the contract, not infrastructure). Non-model domain files (e.g. `representativeConstants.ts`) take no postfix.
- **Handlers: class-owned, private, and never inlined.** Each endpoint class passes its private static handler directly to the Hono route method. Type the handler context as `Context<WorkerHonoEnv>` and name it `ctx` (not `c`). Hono ships status **types** only (`StatusCode` from `hono/utils/http-status`), no value enum — so the `shared-module/httpStatus.ts` `STATUS` const stays; its narrow `HttpStatus` union is a subset of `ContentfulStatusCode`, so `ctx.json(body, status)` type-checks with no casts.
- **Route grouping belongs to the endpoint class** (mirrors the Elysia/.NET pattern): `RepresentativesEndpoints.mappedRepresentativesRoutes()` builds and returns `new Hono<WorkerHonoEnv>()`, and `app/app.ts` mounts that completed group with `app.route('/api', RepresentativesEndpoints.mappedRepresentativesRoutes())`.
- **Entry split (the Cloudflare `export default {}` workaround):** `app/server.ts` is "the server" — the Hono `app` plus `logger`, `onError`, and the `scheduled` cron handler (`export const`). `app/app.ts` is the composition root (the `Program.cs` analog): it imports `app`/`scheduled`, wires the CORS allowlist middleware, mounts the route groups, builds one `ExportedHandler` (`{ fetch: app.fetch, scheduled }`), and is the **only** file with `export default`. `wrangler.toml` `main` points at `app/app.ts`. Everywhere else stays `export const`.
- **Tests live in `test/`** (mirrors the module tree), run with `vitest` + `@cloudflare/vitest-pool-workers` (the `cloudflareTest` plugin → `wrangler.toml`, so tests run in real `workerd` with real bindings). `tsconfig` `types` includes `@cloudflare/vitest-pool-workers/types` (the `/types` subpath gives `cloudflare:test`). `health-check-module` + `test/health-check-module/healthCheck.test.ts` (asserts `GET /api/health-check` → 200, `?fail=true` → 503 via `SELF.fetch`) ship as the always-there scaffold smoke test. Run with `pm test:worker`.
- Cloudflare-specific docs go in `the-flip-effect-cloudflare/documentations/` (e.g. `CIVIC_REPRESENTATIVE_WORKER.md`).
- Secrets (e.g. the Open States API key) live as **Worker secrets** (`wrangler secret put`), never as `VITE_` env vars. The frontend keeps only the public Worker URL (`VITE_CIVIC_WORKER_URL`).

### API Action Pattern

```zsh
export type ApiActionResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: Error;
};
```

### API Naming Rule

- New API actions, API helpers, and API-facing sync/async functions created from this point forward should use the `fetch...` prefix, regardless of HTTP method or whether the source is static JSON, public data, Supabase, or a backend endpoint.
- Do not rename legacy scaffold API/auth utilities just to satisfy this rule. Leave existing scaffold names alone unless the user explicitly asks for a migration.
- Avoid `get...`, `post...`, `put...`, `patch...`, or `delete...` prefixes for new API names unless the user specifically requests that naming.

### TypeScript Action Organization

```zsh
// Static class pattern for modular organization
export class CheckInActions { static async checkIn(...): Promise<ApiActionResult<T>> {} }
export class RecipientActions { static async create(...): Promise<ApiActionResult<T>> {} }
export class StatsActions { static async getMonthly(...): Promise<ApiActionResult<T>> {} }
```

---

## 📚 Documentation Hub

| File                                    | Purpose                                          |
|-----------------------------------------|--------------------------------------------------|
| `SESSION.md`                            | Current session context, recent work, next steps |
| `README.md`                             | Project overview and tech stack                  |
| `src/api/domain/architecture/*.mermaid` | DB ERD, workflows, system architecture           |
| `vite.config.ts`                        | Build config                                     |

---

## 👤 Contributor Preferences

**Communication:** Direct, concise, with detailed reasoning when needed. Explain why, not just what. Teachable moments for TypeScript/Vue patterns.

**Use This:**
- Pinia for ALL state (Setup Store style — `defineStore` with `ref`/`computed`/functions)
- Native Vue lifecycle: `onMounted`, `onUnmounted`, `watch`, `watchEffect`, `computed`
- Component templates with the exact WebStorm-style `<!-- ∞∞∞ -->` / `// ∞∞∞` section dividers shown below
- Comment pattern: `// --- comment ---`
- TailwindCSS (no CSS-in-JS, no `<style scoped>` unless truly necessary)
- PrimeVue for tables/complex UI, Vue Router, Supabase, TypeScript strict mode
- `<script setup lang="ts">` — always, no Options API

**Avoid This:**
- Options API (`data()`, `methods:`, `computed:`, `watch:`)
- Anonymous/inline components
- CSS Modules, styled-components, scoped styles as default
- Prop drilling (use Pinia)
- Magic numbers/strings
- Deleting scaffolded files without permission
- Over-engineering, scope creep

## Scope Control (CRITICAL)

- Do exactly what the user asked for in the current instruction.
- Do not complete adjacent pieces, fill in assumed content, or turn a scaffold/container request into a full feature implementation.
- If the next step seems obvious but was not explicitly requested, ask before attempting it.
- When building UI incrementally, preserve the user's intended pace: create the requested shell, slot, wrapper, or single piece first, then wait for the next instruction.
- Do not add labels, sample data, hardcoded content, images, props, interactions, or layout behavior unless the user specifically asked for them.
- Do not start, restart, or attempt to start local dev servers, preview servers, browser sessions, or long-running watch processes unless the user explicitly asks for that exact action.

---

## 🎨 Code Style Guide (CRITICAL)

### Preferred Vue Component / Page Section Template

**ALL Vue components and pages MUST follow this WebStorm-style section scaffold unless the user provides a newer template. This supersedes older component/page examples below.**

```zsh
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    $BREADCRUMB_ROOT$: $BREADCRUMB_DIRECTORIES$
    > $COMPONENT_FILE_NAME$
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// const props = defineProps<{
//  msg: string;
// }>();

// const { msg } = toRefs(props);

// OR

// const { msg } = defineProps<{
//  msg: string;
// }>();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
  <h1 class="text-4xl text-center items-center py-56">
    $PAGE_NAME$ Page $END$
	</h1>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */

</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
```

**Breadcrumb note:** Vue component/page scaffold breadcrumbs MUST be uppercase. Use `:` after the root folder, `>` between nested folders, and wrap long breadcrumbs by putting the file name on the next line with a leading `>`. Do not shorten, wrap, or alter the divider lines themselves. This does not apply to `index.ts` barrel files; barrel files keep the simpler index/barrel comment style.

**Breadcrumb example:**

```zsh
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > BACKGROUNDS
    > LAYOUT_BACKGROUND_IMAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
```

**Replace:** `$BREADCRUMB_ROOT$` → root folder such as `COMPONENTS` or `PAGES`, `$BREADCRUMB_DIRECTORIES$` → uppercase directory chain, `$COMPONENT_FILE_NAME$` → uppercase snake-style file name, `$PAGE_NAME$` → PascalCase display name, `$END$` → final display suffix or remove it.

**Props note:** Prefer direct destructuring from `defineProps`. Use `const props = defineProps<...>()` with `toRefs(props)` only when the component needs a props object or multiple reactive prop refs.

**Page styling note:** Page files under `src/pages/` may keep page-specific scoped PostCSS styles while the page is being shaped. Extracted reusable components under `src/components/` should stay cleaner and more portable, with styling limited to the component's reusable responsibility.

**Extraction boundary note:** When building page-specific markup in `src/pages/`, add a short HTML comment directly above any block that is likely to be extracted later into `src/components/pages/`. This is required for pages so future extraction points stay obvious while the page is still being shaped. For components in general, add the same kind of comment only when a sub-block is clearly likely to become its own component later.

**Session file note:** Do not update `SESSION.md` during active build iterations. `SESSION.md` is updated only at the end of a session or when the user explicitly asks to capture session state. During a session, keep working context in conversation and final summaries instead.

### Long Tailwind Class Naming

When a Tailwind class list gets long enough to hurt template readability, move it into a clearly named `StyleClasses` constant using `twMerge(clsx(...))`. Use descriptive names that match the element or role, such as `imageStyleClasses`, `dropdownContainerStyleClasses`, `mainContainerStyleClasses`, `heroSectionStyleClasses`, or `bgImageOverlayStyleClasses`.

**Example:**

```zsh
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const imageStyleClasses = twMerge(
  clsx(
    'h-8 w-8 cursor-pointer rounded-full object-cover ring-1',
    'ring-purple-500 transition-opacity duration-150 hover:opacity-80',
    'active:opacity-50 tablet:h-10 tablet:w-10',
  ),
);

const dropdownContainerStyleClasses = twMerge(
  clsx(
    'absolute right-0 top-12 z-50 flex w-80 max-w-[95vw]',
    'flex-col rounded-2xl bg-white',
    'px-6 py-4 text-gray-200 shadow-xl dark:bg-gray-900',
    'min-w-[18rem]',
  ),
);
```

In Vue templates, bind these constants with `:class="imageStyleClasses"` or `:class="dropdownContainerStyleClasses"` instead of leaving long class strings inline.

### Navbar Desktop Note

The desktop navbar should render brand on the left and action controls on the right. Do not render the scaffold `NavCTAButton` "Get Started" button in the navbar unless the user explicitly asks for a real CTA. Preserve `NavCTAButton.vue` as a scaffolded artifact, but use `DarkmodeToggleSwitch` in the navbar action area with `block phone-landscape:hidden` so the toggle is visible on portrait phone and tablet/desktop while hidden on phone/small-tablet landscape.

The reusable Tailwind v4 variant for that behavior lives in `src/app.css`:

```zsh
@custom-variant phone-landscape (@media (orientation: landscape) and (max-width: 1023px));
```

### Barrel Export Style

Use barrel exports only at intentional app boundaries. Root-level barrels collect and re-export assets, components, stores, utilities, and types so consuming files import from stable module boundaries instead of deep nested paths.

For `src/components/`, keep one root component barrel at `src/components/index.ts`. Do not add nested `index.ts` files inside component subdirectories; that creates too many barrels to maintain. New reusable components should be exported from the root component barrel with a clear section comment.

Do not add local barrel files inside `src/pages/`, page-specific directories, or `src/components/pages/pages-composables/`. Page files and page composables should import the exact file they need. The reason is navigation clarity: extra nested barrels create mod-file-style indirection, hide the real source file, and make a Vue app feel heavier than it needs to be.

**Examples:**

```zsh
export { default as NavBar } from './shared/navbar/NavBar.vue';
export { default as Footer } from './shared/footer/Footer.vue';
export { default as HomePage } from './home/home.page.vue';
```

Asset barrels MUST be grouped by source directory with comment headers. Runtime image exports should use Vite ImageTools `?format=webp` whenever the source image supports it. Keep Canva/high-quality source files as PNG/JPG assets, then export the optimized app import as WebP through the barrel.

**Asset barrel example:**

```zsh
/* Approval Rating */
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// approval-rating assets->hero
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
export { default as UsaApprovalMapTier1 } from './approval-rating/usaApprovalMapTier1.png?format=webp';
export { default as UsaApprovalMapTier2 } from './approval-rating/usaApprovalMapTier2.png?format=webp';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
```

### Pinia Store Template

**ALL stores MUST follow this exact Setup Store pattern:**

```zsh
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                        $PATH$
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                       IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const use$STORE_NAME$Store = defineStore('$storeName$', () => {
  // ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
  // --- State ---
  // ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
  const value = ref<Type>(defaultValue);

  // ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
  // --- Getters ---
  // ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
  const derivedValue = computed(() => value.value);

  // ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
  // --- Actions ---
  // ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
  async function fetchData(): Promise<void> {
    // --- action logic ---
  }

  return { value, derivedValue, fetchData };
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
```

**Replace:** `$STORE_NAME$` → PascalCase, `$storeName$` → camelCase store ID

---

### Comment Patterns

**Divider Rule (CRITICAL):** Do not generate or approximate `∞` divider lines from memory. Treat divider lines as fixed code. When adding or editing any comment scaffold in any file type, copy the exact divider line from the same file first. If the file has none, copy from the closest same-kind file. If still unclear, copy the exact scaffold from this `CLAUDE.md`. Before finalizing a diff, scan for shortened or wrapped divider lines and fix them.

**Markup Comments:** Keep comments inside Vue templates light and limited to meaningful UI regions. Use `<!-- ∞∞∞∞∞∞∞∞ TITLE ∞∞∞∞∞∞∞∞ -->` for a short label. When context needs more than one line, use the same eight-character divider above and below the body inside one multi-line HTML comment. Do not use plain `<!-- COMPONENT -->`, `<!-- --- comment --- -->`, or hash/dash dividers in template markup.

**Maintenance Comment Rule:** When creating or refactoring code, add a short one- or two-sentence comment above each reasonably complex top-level object/function and brief local comments where the internal flow would otherwise be unclear six months later. Apply the same treatment to nearby complex code in files already being refactored, keep comments concise, use the established comment style, and never number code comments.

```zsh
// --- Single line comment ---

// ---
// Multi-line comment
// for detailed explanations
// ---
```

**NEVER:** `/* block comments */` (except JSDoc), `//` without dashes

### Control Flow & Block Spacing (CRITICAL)

- **Always use braces** on every `if`/`else`/`for`/`while` — never single-line brace-less statements like `if (x) return;`. The body goes on its own braced line.
- **Always give a blank line above and below** a braced control block, so each block breathes. The only exception is when the block is the very first statement inside its parent (no blank needed directly under the opening `{`) or the last before a closing `}`.

```zsh
// ❌ WRONG — lazy, no braces, cramped
const trimmed = query.trim();
if (!trimmed) return 'name';
if (isZip(trimmed)) return 'zip';

// ✅ CORRECT — braces + blank line above/below each block
const trimmed = query.trim();

if (!trimmed) {
  return 'name';
}

if (isZip(trimmed)) {
  return 'zip';
}
```

### No Mini-Functions / Named Returns (CRITICAL)

- **Do not extract single-use or trivial helper functions.** Inline the logic into its one caller. A file should be **one or two real functions**, not a swarm of tiny `const foo = () => oneThing` wrappers — those are more surface to maintain and read, not less. Only factor something out when it is genuinely reused or is a real, self-contained unit. Never make pure pass-through wrappers (`const refresh = (env) => seedAll(env)`) — call the underlying function directly.
- **Named returns.** Don't return a freshly constructed object/response inline. Bind it to a typed, named variable (e.g. `const result: T = { ... }`), leave a blank line, then `return result`. This applies to every constructed return (success **and** failure objects, `new Response(...)`, etc.) so each outcome is greppable and debuggable. Trivial primitive bails (`return []`, `return undefined`, `return null`) may stay inline.

```zsh
// ❌ WRONG — tiny one-use helper + inline object return
const fail = (message: string) => ({ success: false, message });
export const handle = () => {
  if (bad) return fail('nope');
  return { success: true };
};

// ✅ CORRECT — inlined, named returns
export const handle = (): Result => {
  if (bad) {
    const result: Result = { success: false, message: 'nope' };

    return result;
  }

  const result: Result = { success: true };

  return result;
};
```

---

## Vue Lifecycle & Reactivity

**Use native Vue APIs directly — no wrappers needed.**

```zsh
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue';

// --- Reactive state ---
const count = ref(0);
const doubled = computed(() => count.value * 2);

// --- Lifecycle ---
onMounted(() => {
  // --- fetch data, setup subscriptions ---
});

onUnmounted(() => {
  // --- cleanup ---
});

// --- Watchers ---
watch(searchTerm, (newVal) => {
  if (newVal.length > 2) { performSearch(newVal); }
});

watchEffect(() => {
  // --- auto-tracks dependencies ---
  console.log(count.value);
});
```

---

## State Management (Pinia)

**Pinia for ALL shared/persistent state. Local component-only state uses `ref`/`computed` in `<script setup>`.**

### Persistent State

```zsh
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core'; // or pinia-plugin-persistedstate

export const useDarkModeStore = defineStore('darkMode', () => {
  // --- State (persisted) ---
  const isDark = useLocalStorage('darkMode', false);

  // --- Actions ---
  function toggle(): void {
    isDark.value = !isDark.value;
  }

  return { isDark, toggle };
});
```

### In Components

```zsh
// --- always destructure with storeToRefs for reactivity ---
import { storeToRefs } from 'pinia';
import { useDarkModeStore } from '@/lib/stores/dark-mode.store';

const darkModeStore = useDarkModeStore();
const { isDark } = storeToRefs(darkModeStore);
```

**Anti-patterns:**
```zsh
// ❌ WRONG — loses reactivity
const { isDark } = useDarkModeStore();

// ✅ CORRECT
const { isDark } = storeToRefs(useDarkModeStore());
```

---

## TypeScript Conventions

**Strict Mode:** `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`

### Array Types

**Prefer `Array<T>` over `T[]` in new TypeScript code.** This keeps collection types visually explicit and easier to scan in complex object shapes.

```zsh
// ✅ CORRECT
type UserListProps = {
  users: Array<User>;
  selectedIds: Array<string>;
};

// ❌ WRONG
type UserListProps = {
  users: User[];
  selectedIds: string[];
};
```

### Props Pattern (CRITICAL)

**Always destructure directly from `defineProps`. Never use `withDefaults` or `const props =`.**

```zsh
// ✅ CORRECT — Option 1: separate interface (complex props)
interface CardProps {
  title: string;
  variant?: 'primary' | 'secondary';
  count?: number;
}

const { title, variant = 'primary', count = 0 } = defineProps<CardProps>();

// ✅ CORRECT — Option 2: inline (simple props)
const { label, disabled = false } = defineProps<{
  label: string;
  disabled?: boolean;
}>();

// ❌ WRONG — withDefaults
const props = withDefaults(defineProps<CardProps>(), { variant: 'primary' });

// ❌ WRONG — const props =
const props = defineProps<CardProps>();
```

### Functions (Arrow Functions)

**Always use arrow functions. Never use `function` declarations in `<script setup>`.**

```zsh
// ✅ CORRECT
const handleClick = (): void => { router.push(path); };
const getTotal = (items: Array<CartItem>): number => items.reduce((sum, i) => sum + i.price, 0);

// ❌ WRONG
function handleClick(): void { router.push(path); }
```

### No Inline CSS (CRITICAL)

**Never use `:style={}` bindings. All styling must use one of:**
- Tailwind utility classes
- `twMerge(clsx(...))` for dynamic/conditional long class strings
- `app.css` via `@utility` for custom animations/utilities

```zsh
// ✅ CORRECT
const boxClass = twMerge(clsx('flex items-center', { 'bg-slate-900': isDark }));

// ❌ WRONG
:style="{ backgroundColor: isDark ? '#0f172a' : '#fff' }"
```

**Error Handling (MANDATORY):**

```zsh
// ✅ GOOD — typed catch
try {
  // --- code ---
} catch (error: unknown) {
  if (error instanceof Error) { console.error(error.message); }
  throw error;
}

// ❌ BAD — untyped catch
try {
  // --- code ---
} catch (error) {
  console.error(error);
}
```

**Never:** `any` type, type assertions (`as`) unless unavoidable, `@ts-ignore`

---

## 🚀 Commands

```zsh
pm dev              # Dev server (localhost:5173)
pm build            # Production build → dist/
pm preview          # Preview production locally
```

**Note:** Use alias `pm` (not `pnpm`) for all package manager commands.

---

## 🗣️ Response Format (CRITICAL — Rolling 1–33 Numbering)

**Every response to the user is a numbered list.** Not prose paragraphs, not loose bullets. Each top-level point gets the next number in a running counter.

**The counter is a rolling session counter.**
- It starts at `1` on the first response of a session.
- It keeps counting across the ENTIRE response and across EVERY response that follows.
- It NEVER restarts at `1` just because a new response, a new section, or a new topic begins.
- When it reaches `33`, the NEXT number wraps back to `1` and continues from there.
- The counter never resets because the request changed, because the user asked something new, or because the previous turn ended. Only reaching `33` resets it.

**Structure of a numbered point:**
- The number carries one short declarative sentence — a claim, a result, or a heading-style statement ending in `:`.
- Supporting detail sits under it as plain `-` sub-bullets.
- Sub-bullets are NEVER numbered and NEVER lettered. No `1a`, no `2.1`, no `i.`/`ii.`.
- Code blocks, tables, and file lists may sit under a number without consuming a number.

**Questions keep the same counter.** When asking the user something, each distinct option is its OWN number on its own line, drawn from the same running count. A question section never restarts at `1`.

**Closing sections do not take numbers.** `Files touched`, `Files removed`, and `Files created` are unnumbered plain path lists at the very end — no descriptions, no line numbers, just relative paths.

**Reference shape:**

```zsh
1. Refactored, Sin. The visible player flow now lives entirely in one YouTubeVideoPlayer.vue:

  - Single-video player
  - Custom controls
  - Error/fallback states

2. Only true support boundaries remain separate:

  - Composable: YouTube iframe lifecycle
  - Utility: shared SDK loading and URL parsing

3. Public usage remains unchanged and simple:

  <YouTubeVideoPlayer :video-url="YOUTUBE_VIDEO_URL" />

4. Verification passed:

  - 8/8 tests
  - Clean production build
  - Template remains untouched until you approve this version

Files touched

  - src/components/shared/youtube-video-player/YouTubeVideoPlayer.vue

Files removed

  - src/components/shared/youtube-video-player/YouTubeVideoFrame.vue
```

**Tone:** direct, short sentences, no filler, no hedging, no restating the request back. State the result, then the detail.

---

## 🧭 Agent Operating Notes

**Code Delivery:**
- Provide drop-in code respecting templates
- Cite file paths when recommending edits
- Replace ALL placeholders (`$COMPONENT_NAME$`, `$VIEW_NAME$`, `$PATH$`, `$STORE_NAME$`)
- Maintain the exact WebStorm-style `<!-- ∞∞∞ -->` / `// ∞∞∞` divider shape shown in the Preferred Vue Component / Page Section Template. Do not shorten, wrap, or replace divider lines.
- Control flow: always use braces on `if`/`else`
- Prefer existing stack (Tailwind/PrimeVue/@vueuse/motion)
- SESSION.md only updated at task end after confirmation
- git commands only when interacting with git
- Summarize work with bulleted file paths

**Before Changes:**
- Read existing file first
- Ask before major refactors
- Never delete scaffolded files without permission
- Confirm scope before expanding

**CRITICAL:**
- Don't assume anything. Wait for user instructions.
- Respect "no code" and "ttm" rules = ANSWER ALL QUESTIONS FIRST, then DO NOT generate/modify code at all
- **ALWAYS end every response with all files touched — no inline comments, just paths:**
  - List every file modified, created, or deleted with relative paths
  - No descriptions, no line numbers, just the clean path list
- **Response numbering is governed by the Response Format (CRITICAL — Rolling 1–33 Numbering) section above.** The counter rolls across responses and only resets after `33`.
- **When asking questions, ALWAYS use a single FLAT, continuously-increasing numbered list (1, 2, 3, 4, 5, …) so the user can respond by number.** NEVER use letter sub-bullets or nested numbering (no `1a`/`1b`, no `2.1`). Each distinct option is its OWN number on its own line — if a question has two choices, that is two numbers, not one number with `a`/`b` under it. A short plain-text label (e.g. `Alias naming:`) may prefix the option text, but the number out front always just increments.
- **The count is continuous across the ENTIRE response, not per section.** If the response has more than one numbered list (e.g. a "Work it costs" list THEN a "Questions" list), the second list keeps counting from where the first stopped — it does NOT restart at 1. Never emit two lists in one response that both begin at 1. If two sections each need their own 1-based numbering, merge them into one list or renumber the second so the sequence is unbroken (… 5, then 6, 7, 8 …).
- Never use implicit `any` in callbacks: `(item: Type) => ...`
- If proposing plans/questions, STOP and wait for user response

**Validation:**
- Run `pm build`, `vue-tsc --noEmit` when feasible
- Check console errors, dark mode, responsive design
- Call out skipped validation
- Component tests are temporary implementation tools. After a UI component is verified, delete its local test file.
- Keep only one reusable UI-component test example in `vuejs-frontend-template`; utility, API, and business-logic tests remain durable.

**Template Compliance:**
- ALWAYS use `<script setup lang="ts">` — never Options API
- ALWAYS use component/view templates with divider sections
- NEVER skip the exact divider sections from the Preferred Vue Component / Page Section Template
- ALWAYS use `storeToRefs` when destructuring Pinia stores
- ALWAYS define stores with Setup Store (`defineStore('id', () => { ... })`)

**Anti-Patterns:**
❌ Options API | ❌ `storeToRefs` omitted on destructure | ❌ Skipping dividers | ❌ `any` type | ❌ Inline styles | ❌ Prop drilling | ❌ Deleting files | ❌ Scoped styles as default

---

## 🔒 Gemini CLI Protocol (Hard-Headed AI Guard)
- **STRICT INSTRUCTION:** Do not execute ANY command or modify ANY file without the user's explicit confirmation or instruction.
- **NO ASSUMPTIONS:** Never assume what the user wants to do next. Ask first.
- **WAIT:** Stop and wait for the user to say "Go", "Yes", or "Execute".
- **CONFIRMATION:** When proposing a plan, explicitly state: "Do I have your permission to proceed?" and WAIT for the answer.
- **VIOLATION:** Jumping ahead or acting autonomously is a critical failure.

---

**Last Updated:** March 9, 2026 | **Template:** `vuejs-frontend-template`

_Single source of truth for AI assistants. Keep updated as patterns evolve._
