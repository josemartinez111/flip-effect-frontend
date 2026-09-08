// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB: CONSTANTS > TARIFF_ACTIVITY_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Give the fast KV path a short head start; Treasury remains a bounded, keyless fallback when Cloudflare cannot reach it. ---
export const TARIFF_WORKER_TIMEOUT_MS = 2000;
export const TARIFF_TREASURY_TIMEOUT_MS = 5000;
export const TARIFF_HISTORY_MONTHS = 24;
export const TARIFF_SOURCE_NAME =
	'U.S. Treasury · Monthly Treasury Statement';
export const TARIFF_SOURCE_URL =
	'https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/receipts-of-the-u-s-government';
export const TARIFF_API_URL =
	'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
