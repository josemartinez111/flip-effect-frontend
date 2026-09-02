// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > DOMAIN
// > APPROVAL_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { ApprovalType } from '@approval-module/domain/approvalModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- KV entry lifetime: long enough that the last-good copy survives weeks as the fail-safe (AP-NORC polls ~monthly). ---
export const APPROVAL_CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

// --- Refetch trigger: a cached rating older than this is stale → re-pull the source (otherwise serve the cache). ---
export const APPROVAL_FRESH_WINDOW_MS = 24 * 60 * 60 * 1000;

// --- NYT average window: only select polls ending within this many days feed the trump average (select polls are sparser, so wider than a raw-feed window). ---
export const NYT_RECENT_WINDOW_DAYS = 21;

// --- KV key per feed so trump + economy cache side by side. ---
export const approvalCacheKey = (approvalType: ApprovalType): string =>
	`approval:${approvalType}`;

// --- Caption labels surfaced to the frontend hover (one per source). ---
export const NYT_SOURCE_LABEL = 'New York Times';
export const APNORC_SOURCE_LABEL = 'AP-NORC';

// --- Only NYT "select pollsters" (is_select) feed the average — their reliability screen drops the GOP-leaning houses that skew a raw mean high. ---
export const NYT_SELECT_ONLY = true;

// --- AP-NORC WordPress discovery: newest approval projects first; scan a few for one carrying the economy topline. ---
export const APNORC_PROJECT_QUERY = {
	search: 'approval',
	orderby: 'date',
	order: 'desc',
	per_page: '6',
} as const;

// --- How many of the newest projects to try before giving up (each attempt = one page fetch + PDF parse). ---
export const APNORC_MAX_PROJECTS_TO_SCAN = 4;

// --- Marks the topline PDF anchor on a project page (HTMLRewriter selector + suffix guard; Methodology PDF lacks it). ---
export const APNORC_TOPLINE_PDF_MARKER = 'Topline';

// --- "The economy" topline row → [, fieldwork, approve, disapprove]. Tuned to unpdf's merged-page text. ---
export const APNORC_ECONOMY_ROW_REGEX =
	/The economy\s+(\d{1,2}\/\d{1,2}-\d{1,2}\/\d{4})\s*\(N=[\d,]+\)\s+(\d{1,3})\s+(\d{1,3})/;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
