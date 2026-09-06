// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > CONGRESSIONAL-BALANCE-MODULE > DOMAIN
// > CONGRESSIONAL_BALANCE_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- The compact balance lives beside the full roster in REPRESENTATIVES_CACHE. ---
export const CONGRESSIONAL_BALANCE_KEY =
	'federal:congressional-balance:v1';
export const CONGRESSIONAL_BALANCE_SOURCE = 'Congress Legislators';
export const DAILY_CONGRESSIONAL_BALANCE_CRON = '0 10 * * *';
export const HOUSE_TOTAL_SEATS = 435;
export const SENATE_TOTAL_SEATS = 100;

// --- Exclude non-voting delegates so House filled seats and vacancies align with its 435 voting seats. ---
export const NON_VOTING_HOUSE_JURISDICTIONS = new Set<Uppercase<string>>([
	'AS',
	'DC',
	'GU',
	'MP',
	'PR',
	'VI',
]);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
