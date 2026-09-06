// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > APPLICATION
// > REPRESENTATIVES_SEED_ON_DEPLOY.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { Utils } from '@shared-module/utils';
import {
	getSeededVersion,
	seedAllStates,
	setSeededVersion,
} from '@representatives-module/infrastructure/representativesCache';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Per-isolate fast path: once this isolate has claimed the live version, later requests do nothing. ---
let claimedVersionInIsolate: string | undefined;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Background work: confirm via KV that no other isolate already seeded this version,
// claim it, then run the full get-all. Crash-proof — it runs detached in `ctx.waitUntil`,
// so a failure must never surface on the request that scheduled it.
// ---
const seedForVersion = async (
	env: WorkerEnv,
	versionId: string,
): Promise<void> => {
	const seedRepresentativesForVersionCallback =
		async (): Promise<void> => {
			const alreadySeeded = await getSeededVersion(env);

			if (alreadySeeded === versionId) {
				return;
			}

			// --- Claim the version before seeding so concurrent first-requests don't double fan-out. ---
			await setSeededVersion(env, versionId);
			await seedAllStates(env);
		};

	const seedRepresentativesForVersionResults =
		await Utils.APITryCatch<void>({
			callback: seedRepresentativesForVersionCallback,
			errorContext: 'REPRESENTATIVES_SEED_ON_DEPLOY',
		});

	if (seedRepresentativesForVersionResults.error !== undefined) {
		console.error(
			`[seed-on-deploy] ${seedRepresentativesForVersionResults.error.message}`,
		);
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Deploy-bound refresh: a new Worker version (or one never seeded) triggers the get-all
// once, in the background, off the first request that reaches this isolate. Never blocks.
// ---
export const seedRepsOnNewVersion = (
	env: WorkerEnv,
	// --- Only `waitUntil` is needed; a structural type keeps this off the churny ExecutionContext generic. ---
	ctx: { waitUntil: (promise: Promise<unknown>) => void },
): void => {
	const versionId = env.CF_VERSION_METADATA?.id;

	// --- No version (local/test) or already claimed in this isolate → nothing to do. ---
	if (!versionId || claimedVersionInIsolate === versionId) {
		return;
	}

	claimedVersionInIsolate = versionId;
	ctx.waitUntil(seedForVersion(env, versionId));
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
