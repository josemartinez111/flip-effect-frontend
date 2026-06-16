# 🧪 Testing API on Cloudflare Dummy Data

> Dummy search inputs for testing the civic representative Worker through the Vue `Find Your Representatives` UI.
> These are meant to verify the Worker contract, filter mapping, modal output, fallback images, and friendly error states.

---

## 🏛️ US Congress

- `CA` → should return California House + Senate federal reps.
- `90210` → should return CA federal reps; House may broaden if ZIP cannot resolve an exact district.
- `Alexandria Ocasio-Cortez` → should return AOC.
- `Ted Cruz` → should return a federal senator result.

---

## 🏛️ State Lawmakers

- `CA` → should return California state lawmakers if Worker supports state-level state code lookup.
- `Austin, TX` → good city/state state-lawmakers test.
- `Sacramento, CA` → good state capitol test.
- `10001` → New York ZIP state-lawmakers test.

---

## 🧭 Both Levels

- `90210` → should return federal + state records if available.
- `CA` → broad state/federal California test.
- `New York` → broad state/federal New York test.
- `1600 Pennsylvania Ave NW, Washington, DC` → full address geocoder test.

---

## 🚨 Failure / Validation

- Empty input → should show the enter-search message.
- `asdfasdfasdf` → should show no reps / not found.
- `00000` → should show no reps or lookup failure gracefully.

---

## ✅ What To Watch In The UI

- The modal should open only after a successful Worker result.
- Missing or broken `photoUrl` values should render `RepresentativePlaceholder`.
- Search guidance should return after closing the modal.
- The filter labels should stay educational: Congress = House + Senate, State Lawmakers = state capitol reps, Both Levels = both systems.

---

_Last updated: JUN-16-2026 (`Civic Representative API Dummy Search Tests`)_
