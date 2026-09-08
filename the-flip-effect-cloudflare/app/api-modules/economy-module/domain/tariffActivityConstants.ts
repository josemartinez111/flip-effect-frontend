// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > DOMAIN > TARIFF_ACTIVITY_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
export const TARIFF_CACHE_KEY = 'economy:tariffs:v1';
export const TARIFF_FRESH_WINDOW_MS = 24 * 60 * 60 * 1000;
export const TARIFF_HISTORY_MONTHS = 24;
export const TARIFF_SOURCE_TIMEOUT_MS = 5000;
export const TARIFF_SOURCE_NAME =
	'U.S. Treasury · Monthly Treasury Statement';
export const TARIFF_SOURCE_URL =
	'https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/receipts-of-the-u-s-government';
export const TARIFF_API_URL =
	'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4';
