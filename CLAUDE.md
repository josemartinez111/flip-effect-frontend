# 🎨 CLAUDE.md - AI Assistant Context & Instructions

> !!NOTE!! **"no code" rule — when active: ANSWER ALL USER QUESTIONS FIRST, then DO NOT generate or modify ANY code whatsoever. Wait for explicit user instruction before writing a single line. Questions always come before code.**

> 🔥🔥🔥 !!!NEVER EVER WRITE, EDIT, CREATE, OR TOUCH ANY FILE OUTSIDE THE PROJECT DIRECTORY WITHOUT EXPLICIT USER PERMISSION!!! This includes `~/.config/`, `~/.claude/`, or ANY path outside the current project root. ASK FIRST. ALWAYS. NO EXCEPTIONS. 🔥🔥🔥

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
│   │   ├── global-composables-hooks/     # Shared composables (useGradient, etc.)
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
│   │   └── useNavLinks.ts                # NavLinkType + useNavLinks composable
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

### API Action Pattern

```typescript
export type ApiActionResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: Error;
};
```

### TypeScript Action Organization

```typescript
// Static class pattern for modular organization
export class CheckInActions { static async checkIn(...): Promise<ApiActionResult<T>> {} }
export class RecipientActions { static async create(...): Promise<ApiActionResult<T>> {} }
export class StatsActions { static async getMonthly(...): Promise<ApiActionResult<T>> {} }
```

---

## 📚 Documentation Hub

| File | Purpose |
|------|---------|
| `SESSION.md` | Current session context, recent work, next steps |
| `README.md` | Project overview and tech stack |
| `src/api/domain/architecture/*.mermaid` | DB ERD, workflows, system architecture |
| `vite.config.ts` | Build config |

---

## 👤 Contributor Preferences

**Communication:** Direct, concise, with detailed reasoning when needed. Explain why, not just what. Teachable moments for TypeScript/Vue patterns.

**Use This:**
- Pinia for ALL state (Setup Store style — `defineStore` with `ref`/`computed`/functions)
- Native Vue lifecycle: `onMounted`, `onUnmounted`, `watch`, `watchEffect`, `computed`
- Component templates with `//⚫️ ∞∞∞` dividers
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

---

## 🎨 Code Style Guide (CRITICAL)

### Component Template

**ALL regular components MUST follow this exact template:**

```vue
<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!--                          $PATH$                                   -->
<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->

<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                           IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                           PROPS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

interface ShowProps {
  class?: string;
  // Add other props here
}

const props = withDefaults(defineProps<ShowProps>(), {});

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                        COMPONENT LOGIC
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
  <main :class="props.class">
    <h1 class="text-4xl text-center font-semibold items-center py-16">
      $COMPONENT_NAME$ Component
    </h1>
  </main>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
```

**Replace:** `$PATH$` → file path, `$COMPONENT_NAME$` → PascalCase name

---

### View (Page) Template

**ALL view/page components MUST follow this exact template:**

```vue
<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!--                          $PATH$                                   -->
<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->

<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                           IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                           VIEW LOGIC
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
  <main class="min-h-screen w-full dark:bg-black dark:text-white bg-white">
    <h1 class="text-4xl text-center items-center py-56">
      $VIEW_NAME$ View
    </h1>
  </main>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
```

**Replace:** `$PATH$` → file path, `$VIEW_NAME$` → PascalCase (no "View" suffix in the label)

---

### Pinia Store Template

**ALL stores MUST follow this exact Setup Store pattern:**

```typescript
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                        $PATH$
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                       IMPORTS
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

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
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
```

**Replace:** `$STORE_NAME$` → PascalCase, `$storeName$` → camelCase store ID

---

### Comment Patterns

```typescript
// --- Single line comment ---

// ---
// Multi-line comment
// for detailed explanations
// ---
```

**NEVER:** `/* block comments */` (except JSDoc), `//` without dashes

---

## Vue Lifecycle & Reactivity

**Use native Vue APIs directly — no wrappers needed.**

```typescript
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

```typescript
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

```typescript
// --- always destructure with storeToRefs for reactivity ---
import { storeToRefs } from 'pinia';
import { useDarkModeStore } from '@/lib/stores/dark-mode.store';

const darkModeStore = useDarkModeStore();
const { isDark } = storeToRefs(darkModeStore);
```

**Anti-patterns:**
```typescript
// ❌ WRONG — loses reactivity
const { isDark } = useDarkModeStore();

// ✅ CORRECT
const { isDark } = storeToRefs(useDarkModeStore());
```

---

## TypeScript Conventions

**Strict Mode:** `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`

### Props Pattern (CRITICAL)

**Always destructure directly from `defineProps`. Never use `withDefaults` or `const props =`.**

```typescript
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

```typescript
// ✅ CORRECT
const handleClick = (): void => { router.push(path); };
const getTotal = (items: CartItem[]): number => items.reduce((sum, i) => sum + i.price, 0);

// ❌ WRONG
function handleClick(): void { router.push(path); }
```

### No Inline CSS (CRITICAL)

**Never use `:style={}` bindings. All styling must use one of:**
- Tailwind utility classes
- `twMerge(clsx(...))` for dynamic/conditional long class strings
- `app.css` via `@utility` for custom animations/utilities

```typescript
// ✅ CORRECT
const boxClass = twMerge(clsx('flex items-center', { 'bg-slate-900': isDark }));

// ❌ WRONG
:style="{ backgroundColor: isDark ? '#0f172a' : '#fff' }"
```

**Error Handling (MANDATORY):**

```typescript
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

```bash
pm dev              # Dev server (localhost:5173)
pm build            # Production build → dist/
pm preview          # Preview production locally
```

**Note:** Use alias `pm` (not `pnpm`) for all package manager commands.

---

## 🧭 Agent Operating Notes

**Code Delivery:**
- Provide drop-in code respecting templates
- Cite file paths when recommending edits
- Replace ALL placeholders (`$COMPONENT_NAME$`, `$VIEW_NAME$`, `$PATH$`, `$STORE_NAME$`)
- Maintain `<!-- ⚫️ ∞∞∞ -->` / `//⚫️ ∞∞∞` dividers and `// --- comment ---` pattern
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
- Respect "no code" rule = ANSWER ALL QUESTIONS FIRST, then DO NOT generate/modify code at all
- **ALWAYS end every response with all files touched — no inline comments, just paths:**
  - List every file modified, created, or deleted with relative paths
  - No descriptions, no line numbers, just the clean path list
- **When asking questions, ALWAYS use numbered bullets** so the user can respond by number
- Never use implicit `any` in callbacks: `(item: Type) => ...`
- If proposing plans/questions, STOP and wait for user response

**Validation:**
- Run `pm build`, `vue-tsc --noEmit` when feasible
- Check console errors, dark mode, responsive design
- Call out skipped validation

**Template Compliance:**
- ALWAYS use `<script setup lang="ts">` — never Options API
- ALWAYS use component/view templates with divider sections
- NEVER skip `//⚫️ ∞∞∞` dividers
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
