# The Flip Effect — Frontend Architecture Spec

## Project Overview

Single-page interactive political analysis platform mapping the chain of events from the 2026 midterms through 2028. Built as one homepage with all sections rendered on it. No multi-route architecture at launch — additional pages are a future-only decision based on content volume.

## Stack

- Vite + Vue 3 (strict TypeScript)
- TailwindCSS v4+
- PrimeVue (Timeline, Dialog, Accordion, Card, Charts)
- PrimeVue Charts (Chart.js under the hood)
- pnpm
- Vercel (hosting)
- Supabase (deferred — used later for blog and directory backend)

## Starter Template

Already configured — do not rebuild.

- Dark mode default
- Sidebar with navigation links (links scroll to homepage sections, not separate routes)
- Mobile/tablet responsive
- Routing scaffolded but unused at launch — the homepage is the entire app

## Frontend Export Style

Use barrel exports throughout the frontend. Directory-level `index.ts` files should collect and re-export assets, components, pages, stores, utilities, and types so feature files import from stable module boundaries instead of deep nested paths.

**Example:**

```typescript
export { default as NavBar } from './shared/navbar/NavBar.vue';
export { default as Footer } from './shared/footer/Footer.vue';
export { default as HomePage } from './home/home.page.vue';
```

For assets, keep exports grouped by source directory with comment headers so the file stays modular as the asset library grows.

**Example:**

```typescript
/* Approval Rating */
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// approval-rating assets->hero
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
export { default as UsaApprovalMapTier1 } from './approval-rating/usaApprovalMapTier1.png?format=webp';
export { default as UsaApprovalMapTier2 } from './approval-rating/usaApprovalMapTier2.png?format=webp';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
```

## Homepage Structure

### 1. Hero — Decaying America Map

Full-width section at the top. Displays one of 20-30 pre-rendered AI-generated images of America at progressive stages of decay. The image shown is determined by the current presidential approval rating, served from a public polling API (FiveThirtyEight, RealClearPolitics, or equivalent). A simple array maps approval percentage thresholds to an image index — no SVG manipulation, no CSS filters, just an array index lookup.

**Approval-to-image mapping:**

| Approval % | Visual State                                           |
|------------|--------------------------------------------------------|
| 50%+       | Vibrant, full color, healthy America                   |
| 45–49%     | Slight fade, sky hazing                                |
| 40–44%     | City lights dimming, greens shifting yellow            |
| 35–39%     | Grey wash creeping in, water darkens                   |
| 30–34%     | Visible cracks, brown patches spreading                |
| 25–29%     | Wildfire overlays, smoke, flickering cities            |
| 22–24%     | Near monochrome, heavy damage, warning tone            |
| Below 22%  | Grey wasteland, red "New Record" marker with timestamp |

**Hero supporting elements:**

- Current approval rating displayed prominently
- Truman Line indicator showing distance to the 22% historical low (Truman's record)
- 90-day approval trajectory sparkline
- Source attribution and last updated timestamp
- Permanent commemorative state if approval drops below 22% — red marker with date stamp and explainer linking to Truman historical context

### 2. Trump vs Truman Approval Comparison

Side-by-side data visualization comparing Trump's current approval rating trajectory against Truman's historic low of 22% — the lowest presidential approval ever recorded. PrimeVue Charts line chart with both data series. Permanent reference point on the page that gives the Truman Line in the hero its narrative weight.

### 3. The Margin

House: Republicans 220, Democrats 215, Democrats need net +3 to flip. Senate: Republicans 53, Democrats 47. Vacancy tracker. Special elections: Florida (Rubio's seat, Ashley Moody appointed) and Ohio (Vance's seat, Jon Husted appointed). Interactive seat counter showing flips needed for majority.

### 4. The Exodus

Republican retirements and resignations tracker. 33 Republicans not running for re-election in the House versus 21 Democrats. 6 Republican senators not running. Side-by-side comparison to the 2018 wave cycle. Names, dates, stated reasons.

### 5. The Scandals

Lobstergate ($93B Pentagon spending), DOJ corruption, DOGE hypocrisy. All claims attributed to source organizations (Open the Books, CREW, ProPublica). Never stated as original findings — always attributed.

### 6. The Streets — No Kings Protest Tracker

Event counts, locations, attendance estimates. Emphasis on protests in red states and competitive districts. Sourced data displayed as cards or list with optional map overlay.

### 7. The Numbers

Trump approval ratings over time (PrimeVue Charts line chart). Gas price tracker. Generic ballot polling. Consumer sentiment. 42 battleground House districts (22 Dem, 20 Rep). 9 battleground Senate seats (2 Dem, 7 Rep).

### 8. The Domino Chain

Core feature — interactive timeline.

PrimeVue Timeline component as the centerpiece of the page. Each node represents a political event or domino in the cause-and-effect chain. Clicking a node opens a PrimeVue Dialog or expands an Accordion with sourced analysis, embedded data, and visualizations.

**Node categories:** House Flip, Senate Races, Investigations, Legal Actions, Public Opinion, Constitutional Reform

**Node status colors:** Completed (green), In Progress (yellow), Projected (gray)

**Filter bar:** Horizontal filter above the timeline — filter by category, date range, or status

**Share This Domino:** Each node has its own deep-link URL with auto-generated Open Graph card containing the event title, status color, and teaser. Allows individual nodes to be shared on social.

**Domino sequence narrative:** House flips → investigations → Senate flips → pressure mounts → accountability

### 9. Where's Your Rep

Zip code input field. Returns the user's representative, key votes, and whether their seat is in play for 2026. Powered by ProPublica Congress API (free).

### 10. Heat Map

Interactive U.S. map color-coded by district and state competitiveness. Clicking a state filters the timeline above to only show nodes relevant to that state.

### 11. Then vs Now

Side-by-side comparison cards: 2018 versus 2026. Republican retirements, approval ratings, generic ballot, special election results. Visual pattern recognition between the wave year and the current cycle.

### 12. Countdown Timers

Election day (November 3, 2026), upcoming primary dates by state, filing deadlines, special election dates in Florida and Ohio. Live countdown components.

### 13. The Fix

Forward-looking section. Constitutional amendment proposals, DOJ Criminal Investigations Division concept, Independent Counsel restoration, structural reforms.

### 14. Sources & Partners Directory

Backlink directory. Free listings for watchdog organizations and journalists. Paid premium placements for political consultants, campaign strategists, and civic tech companies. Each entry stored later in Supabase with images linked to rows by ID. All entry descriptions are written in original language — never copied from source material.

### 15. Footer

- Stripe donation button (label TBD, not "Buy Me a Coffee" or "Ko-fi" — direct Stripe integration)
- Link to FantumWave.io (the consultation paywall and burner phone flow lives on FantumWave.io, NOT on this site)
- All site disclaimers

## Data Sources

- Approval rating: VoteHub polling API — fetched directly by frontend action or utility for now; no full backend API is required yet
- Truman historical data: static reference data
- Polling, gas prices, generic ballot, consumer sentiment: public APIs where available
- Representative lookup: ProPublica Congress API
- Timeline nodes, scandals, retirements, protest data: structured content stored in Supabase later (deferred from launch)

### Approval Rating Data Source

Use **VoteHub** (`https://votehub.com/polls/api/`) as the API for presidential approval rating data. It is free, RESTful, returns clean JSON, and aggregates from credible pollsters including Reuters/Ipsos, Gallup, YouGov, and Quinnipiac. No subscription or API key required at the free tier.

**Recommended endpoint:**

```http
GET https://api.votehub.com/polls?poll_type=approval&subject=donald-trump
```

For credibility and attribution, also reference **FiftyPlusOne.news** as a trusted independent polling aggregator currently operating. It is run by G. Elliott Morris, formerly the Editorial Director of Data Analytics at ABC News and the architect of FiveThirtyEight's polling model before FiveThirtyEight shut down in March 2025. Cite FiftyPlusOne on the site when displaying approval data for credibility.

**Current placeholder context (as of May 6, 2026):** VoteHub's public live average shows Trump's job approval at approximately **40% approve** and **57% disapprove**. This is a static frontend placeholder until the VoteHub fetch action is wired.

## Monetization Integrations

- Stripe direct integration (donation button)
- Google AdSense placeholder slots in sidebar and between content sections — low density. Do not apply for AdSense approval until 15+ timeline nodes with real written analysis are live.
- Affiliate link slots in scandals and directory sections (deferred)
- Sponsorship "presented by" slots on timeline category headers (deferred)
- Paid premium placement slots in Sources & Partners directory (deferred)

## Disclaimers

Rendered on site.

- **Editorial:** All content is analysis and opinion sourced from public reporting. Not legal claims.
- **Directory:** By providing links to other sites, The Flip Effect does not guarantee, approve, or endorse the information or products available on these sites.
- **Consultation:** (Hosted on FantumWave.io, not this site) Non-refundable consultation access fee. Not a deposit toward services.

## Social Integration

- Share buttons configured for Instagram and Threads only — no other platforms
- Open Graph meta tags on every timeline node URL
- "Down Goes Frazier" used as recurring social catchphrase in share copy templates

## SEO Targets

- "2026 midterm Senate map interactive"
- "Republican retirements tracker 2026"
- "Trump approval rating timeline"
- "2026 election tracker"
- "2026 midterm predictions"

Pages must be indexable from launch so Google has crawl history before traffic spikes during election season.
