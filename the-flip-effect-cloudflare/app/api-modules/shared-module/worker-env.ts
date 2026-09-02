// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > SHARED-MODULE > WORKER_ENV.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Worker bindings. Secrets never live in code; set via `wrangler secret put`. ---
export type WorkerEnv = {
	REPRESENTATIVES_CACHE: KVNamespace;
	APPROVAL_CACHE: KVNamespace;
	// --- Cloudflare-injected deploy version (id/tag/timestamp) → drives the seed-on-new-version refresh. ---
	CF_VERSION_METADATA: {
		id: string;
		tag: string;
		timestamp: string;
	};
	ALLOWED_ORIGINS: Array<string>;
	OPEN_STATES_API_URL: string;
	OPEN_STATES_API_KEY: string;
	CONGRESS_LEGISLATORS_CURRENT_URL: string;
	CONGRESS_LEGISLATOR_IMAGE_BASE_URL: string;
	CENSUS_GEOCODER_API_URL: string;
	// --- Approval feeds (both public, no key). Switched on ApprovalType in approval-module. ---
	NYT_APPROVAL_URL: string;
	APNORC_WP_API_URL: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Hono env generic: every `new Hono<WorkerHonoEnv>()` types `ctx.env` as the bindings above. ---
export type WorkerHonoEnv = {
	Bindings: WorkerEnv;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
