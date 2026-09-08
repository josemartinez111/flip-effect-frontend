// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > DOMAIN > HOUSEHOLD_PRICE_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- A separate key/route prevents cached Treasury dollars from being mistaken for Harvard price indices. ---
export const HOUSEHOLD_PRICE_CACHE_KEY = 'economy:household-prices:v1';
export const HOUSEHOLD_PRICE_FRESH_WINDOW_MS = 24 * 60 * 60 * 1000;
export const HOUSEHOLD_PRICE_TIMEOUT_MS = 5000;
export const HOUSEHOLD_PRICE_MAX_BYTES = 512_000;
export const HOUSEHOLD_PRICE_MAX_ROWS = 5000;
export const HOUSEHOLD_PRICE_SOURCE =
	'Harvard Business School · Pricing Lab';
export const HOUSEHOLD_PRICE_SOURCE_URL =
	'https://www.pricinglab.org/tariff-tracker/';
export const HOUSEHOLD_PRICE_DATA_URL =
	'https://www.pricinglab.org/files/Cavallo_Llamas_Vazquez_cheapflation.csv';
export const HOUSEHOLD_PRICE_CSV_HEADER =
	'date_str,index_1_imp_ma,index_2_imp_ma,index_3_imp_ma,index_4_imp_ma,index_imp_ma';

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
