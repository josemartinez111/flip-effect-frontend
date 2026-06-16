# 🏛️ Civic Representative Lookup
> API source notes for the homepage `Find Your Representatives` search.
> This explains which data sources need keys, which are public, and what the UI should expect before the full action wiring is finished.

---

## 🎯 Purpose

The homepage representative search is split across public federal data and Open States state-legislator data.

The goal is to let users search by ZIP, city, state, address, or representative name, then show matching representatives with basic profile data, chamber, party, district, contact links, and photos when available.

---

## ✅ Keyless Sources

### 🇺🇸 Federal / House / Senate

**Source:** `unitedstates/congress-legislators`

**Env Key:**
```env
VITE_CONGRESS_LEGISLATORS_CURRENT_URL=https://unitedstates.github.io/congress-legislators/legislators-current.json
```

**Used For:**
- Federal representatives
- House filter
- Senate filter
- Name/state/district matching after the JSON is fetched

**API Key Needed:** No

---

### 🖼️ Federal Representative Photos

**Source:** `unitedstates/images`

**Env Key:**
```env
VITE_CONGRESS_LEGISLATOR_IMAGE_BASE_URL=https://unitedstates.github.io/images/congress/225x275
```

**Used For:**
- Federal representative headshots by `bioguideId`

**API Key Needed:** No

---

### 🗺️ Address / ZIP Geocoding

**Source:** U.S. Census Geocoder

**Env Key:**
```env
VITE_CENSUS_GEOCODER_API_URL=https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
```

**Used For:**
- Resolving address/ZIP searches to location data
- Getting state and congressional district context before filtering results

**API Key Needed:** No

**Important Note:**
If browser CORS or reliability becomes a problem, move this call behind a backend proxy.

---

## 🔑 Keyed Source

### 🏛️ State Representatives

**Source:** Open States / Plural

**Env Keys:**
```env
VITE_OPEN_STATES_API_URL=https://v3.openstates.org
VITE_OPEN_STATES_API_KEY=replace_with_open_states_api_key
```

**Used For:**
- State filter
- State-house representatives
- State-senate representatives
- Location-based state legislator lookup through `/people.geo`
- State legislator search through `/people`

**API Key Needed:** Yes

**Get API Key:**
- Profile/API key page: https://open.pluralpolicy.com/accounts/profile/#apikey
- Signup page: https://open.pluralpolicy.com/accounts/signup/

**Free Status:**
Open States is still presented as an Open API source and its docs say API keys are required. The public site says Open API users can manage API key registration there.

**Current Key Tier:**
- Tier: Default new user
- REST/v3 usage: Use the same account key through the `X-API-KEY` header or `?apikey` query parameter
- GraphQL daily limit: 500 requests per day
- GraphQL rate limit: 1 request per second

**Important Note:**
The real API key belongs in local `.env` or deployment env settings only. Do not paste the real key into `.env.template`, docs, or tracked source files.

---

## 🧩 Frontend Behavior

### Current Placeholder State

The homepage search UI now displays a small API status note:

- Federal, House, and Senate are marked keyless.
- State lookup warns when `VITE_OPEN_STATES_API_KEY` still equals `replace_with_open_states_api_key`.
- The note links directly to the Open States API key page when State is selected and no real key is configured.

### Next Wiring Step

Wire the existing action into the UI:

```ts
fetchCivicRepresentativesAction({
	query,
	filters,
});
```

The UI should handle:
- Loading state
- Empty state
- Error state
- Missing Open States key state
- Result cards from `civicRepresentatives.representatives`

---

## 🧠 Architecture Notes

- Keep env reads inside `GlobalEnvs`.
- Do not read `import.meta.env` directly in components or actions.
- Keep raw third-party response shapes private inside action helpers.
- Keep the app-facing representative shape flattened.
- Keep federal and state results in one `representatives` array with `source: 'federal' | 'state'`.

---

_Last updated: JUN-13-2026 (`Civic Representative Lookup API Notes`)_
