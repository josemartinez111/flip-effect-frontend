# 🧬 Flattening TypeScript — Lean Types With Modern TS

> How to cut type files in half without losing safety. Every rule here leans on **modern TypeScript**
> (structural typing, inference, utility types, `satisfies`, `const`). Reference this when a type file
> feels tall, repetitive, or over-divided.

---

## 🎯 The Goal

Modern TypeScript is **structural** — it cares about the *shape* of data, not how many named
aliases you stack up. That means most vertical bloat in a type file is decoration, not safety.
Flattening removes the decoration and lets the compiler keep the guarantees.

Rule of thumb: **if deleting a line doesn't weaken the type, delete it.**

---

## 1. ➖ Single-line short unions

Stacked pipes read as "important." Most unions aren't — collapse them.

```ts
// ❌ tall
export type Source =
	| 'federal'
	| 'state';

// ✅ flat
export type Source = 'federal' | 'state';
```

Keep the multi-line form **only** when the union genuinely overflows `printWidth` after collapsing.
Let Prettier arbitrate — don't hand-wrap something that fits.

---

## 2. 🪺 Inline small nested objects

Modern TS has no penalty for inline object literals. A one-off nested shape does not need its
own named type or its own block of lines.

```ts
// ❌ exploded
export type Person = {
	id?: {
		bioguide?: string;
	};
	coordinates?: {
		x?: number;
		y?: number;
	};
};

// ✅ inline
export type Person = {
	id?: { bioguide?: string };
	coordinates?: { x?: number; y?: number };
};
```

Same for arrays of small shapes: `links?: Array<{ url?: string }>;`.

---

## 3. 🧩 Don't name a type you use once

A named alias earns its keep only if it's **reused** or **exported as contract**. A shape used in
exactly one place can live inline — structural typing makes the named version redundant.

```ts
// ❌ alias used once
type Coordinates = { x?: number; y?: number };
type Match = { coordinates?: Coordinates };

// ✅ inline the single-use shape
type Match = { coordinates?: { x?: number; y?: number } };
```

Reuse it twice? Then name it. Not before.

---

## 4. 🛠️ Derive, don't re-declare (utility types)

The biggest flattening wins come from making the compiler compute related types instead of you
re-typing them. Modern TS ships these for free:

```ts
type Rep = {
	id: string;
	fullName: string;
	party: string;
	photoUrl?: string;
};

// Subset without re-listing fields
type RepCard = Pick<Rep, 'id' | 'fullName' | 'photoUrl'>;

// Everything except some fields
type RepWrite = Omit<Rep, 'id'>;

// Make all optional / required / readonly
type RepPatch = Partial<Rep>;
type RepStrict = Required<Rep>;

// Narrow a union to part of itself
type Source = 'federal' | 'house' | 'senate' | 'state';
type Chamber = Extract<Source, 'house' | 'senate'>;
type NonChamber = Exclude<Source, 'house' | 'senate'>;

// Key→value maps without spelling out each key
type ByState = Record<string, Array<Rep>>;
```

If two types share fields, **one should derive from the other** (`Pick`/`Omit`), not duplicate them.

---

## 5. 🔤 Template literal + mapped types kill repetition

When keys or strings follow a pattern, let the type system generate them.

```ts
// Template literal types
type StateKey = `state:${string}`;
type ImageTier = `tier-${1 | 2 | 3}`;

// Mapped types — transform every key at once
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Flags<T> = { [K in keyof T as `is${Capitalize<string & K>}`]: boolean };
```

Anytime you catch yourself typing `isX`, `isY`, `isZ` by hand, a mapped type can produce them.

---

## 6. ✅ `satisfies` over annotate-and-widen

`satisfies` (TS 4.9+) validates a value against a type **without widening it**, so you keep the
precise inferred shape and drop redundant annotations.

```ts
// ❌ annotation widens — you lose the literal keys
const STATUS: Record<string, number> = { ok: 200, notFound: 404 };
// STATUS.ok is `number`, and typos in keys aren't caught at use sites

// ✅ satisfies — validated AND narrow
const STATUS = { ok: 200, notFound: 404 } satisfies Record<string, number>;
// STATUS.ok is `200`, keys are exact
```

---

## 7. 🧱 `as const` to infer, not declare

`as const` freezes a literal and lets you *derive* the type from the value — one source of truth.

```ts
const FILTERS = ['federal', 'house', 'senate', 'state'] as const;

// Type derived from the array — no second declaration to keep in sync
type Filter = (typeof FILTERS)[number]; // 'federal' | 'house' | 'senate' | 'state'
```

Now the runtime list and the type can never drift.

---

## 8. ✂️ Divider discipline

Comment dividers are structure, not garnish. A full divider between **every** type is noise.

- One header block per file.
- A divider only at a **real section boundary** (e.g. "app contract" vs "raw upstream").
- Between individual types: a blank line is enough.
- Group with a single `// --- label ---`, not a divider each.

---

## 🧪 Keep These Tall (don't over-flatten)

Flattening is for decoration, not clarity. Leave it vertical when the vertical form *is* the
documentation:

- **Public contract objects** (the model other code consumes) — one prop per line.
- **Unions that overflow `printWidth`** after collapsing — let them wrap.
- **Anything where inlining would hide a meaningful distinction.**

Half the lines, all the safety. If a flatten makes the type harder to read or weaker to check,
it's the wrong flatten.

---

_Append new patterns as the codebase adopts newer TS features. Always tie the pattern back to the
modern TS capability that makes it safe._
