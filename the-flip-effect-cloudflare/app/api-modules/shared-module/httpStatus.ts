// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > SHARED-MODULE > HTTP_STATUS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Generic HTTP status codes, cross-cutting across endpoints (reusable in any worker). ---
export const STATUS = {
	OK: 200,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
} as const;

// --- Narrowed union (200 | 400 | 404 | 500 | 503) so `ctx.json(body, status)` stays type-safe, no casts. ---
export type HttpStatus = (typeof STATUS)[keyof typeof STATUS];

export type SuccessHttpStatus = typeof STATUS.OK;

export type FailureHttpStatus = Exclude<HttpStatus, SuccessHttpStatus>;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
