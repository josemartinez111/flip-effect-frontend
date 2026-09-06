# 🔐 Authentication Flow Documentation
## The Flip Effect Vue + Supabase Starter

> **Current status:** The auth UI and local mode switch are scaffolded. The production Supabase and .NET API contract is not wired yet.
>
> **Security rule:** This document contains architecture and setup responsibilities only. Never add credentials, tokens, admin identities, private policy details, or deployed values here.

---

## 🧱 What Supabase Auth Actually Stores

Supabase Auth is an authentication service backed by the project’s PostgreSQL database. Supabase manages its own protected `auth` schema, including the user records and identities used to sign people in.

That does **not** mean this app needs a homemade public `admins` table just to authenticate. Authentication and application authorization are separate:

- Supabase Auth proves who the user is and issues the access token.
- The Flip Effect API decides whether that authenticated user may perform an admin operation.
- An application-owned role/profile table is optional. Add one only if the API needs roles or profile data beyond the managed Auth user.
- Never use user-editable metadata as the authority for admin access.

The browser should not read the protected Auth schema directly. If the UI needs application profile data, expose only the minimum safe data through the .NET API or a separately protected application table.

---

## 🛡️ Chosen Security Boundary

The intended production flow is:

1. Vue starts the Supabase sign-in or recovery flow.
2. Supabase returns a short-lived access token for the authenticated user.
3. Vue sends that token to The Flip Effect API as a Bearer token.
4. The .NET API validates the token and independently authorizes every protected blog operation.
5. Vue uses the returned result only to control presentation and navigation.

Hidden buttons, route guards, Pinia state, local storage, and `VITE_` values are never security boundaries.

### RLS in this architecture

RLS means **Row Level Security**. It is PostgreSQL authorization applied to rows during database queries.

RLS is mandatory when the browser directly queries exposed Supabase tables. The planned Flip Effect flow sends protected blog work through the .NET API instead, so the API owns authorization for those requests. If direct browser-to-table access is added later, define and test RLS in the database migration/backend project—not in this frontend guide.

---

## 🚦 Local Auth Mode

One centralized mode controls the unfinished admin UI:

- `maintenance` shows the admin version locally without running unfinished token checks.
- `auth` runs the real auth path while developing.
- Production builds always resolve to `auth`, even if maintenance is configured accidentally.

Use `VITE_AUTH_MODE=maintenance` while shaping the UI. Change local development to `VITE_AUTH_MODE=auth` only when the Supabase project and backend endpoints are ready.

Maintenance mode is a display tool. It never grants backend permission.

---

## 🔑 Frontend Environment Contract

The frontend may receive these public configuration values at deployment time:

- Supabase project URL
- Supabase publishable key, or the legacy anon key while that project still uses it
- Public .NET API endpoint URLs
- The local auth mode toggle

Keep the actual values in local/deployment environment configuration. Do not write them into this document.

Never expose a Supabase secret key, legacy `service_role` key, database password, signing secret, or backend-only credential through `VITE_`. Every `VITE_` value is shipped to the browser.

Blank values and scaffold placeholders are treated as unconfigured. That keeps unfinished auth and blog requests from firing during a normal route mount.

---

## 🔔 Error Presentation

- Route mounts, refreshes, session checks, and background reads stay silent.
- Field validation and auth failures render next to the relevant form control.
- PrimeVue toasts are reserved for user-triggered actions such as publish, delete, or an explicitly submitted operation.
- Invalid or expired recovery links redirect to the access-denied page without producing a stale remount toast.

---

## ✅ Production Wiring Checklist

1. Create or select the Supabase project and configure the chosen sign-in methods.
2. Configure allowed site and recovery redirect URLs in Supabase.
3. Add the public Supabase values and .NET endpoint URLs to deployment configuration.
4. Implement JWT validation and admin authorization in The Flip Effect API.
5. Replace the transitional client-only session assumptions with the authenticated Supabase session.
6. Protect every blog mutation in the API and add RLS only for tables exposed directly to the browser.
7. Test sign-in, refresh, expiration, sign-out, recovery, denied-user, and unauthorized-mutation flows.
8. Confirm production hides admin controls and rejects protected operations without an authorized token.

---

## 📖 Official References

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Auth architecture](https://supabase.com/docs/guides/auth/architecture)
- [Supabase user management](https://supabase.com/docs/guides/auth/managing-user-data)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Data API security](https://supabase.com/docs/guides/api/securing-your-api)

---

_Last updated: SEP-04-2026_
