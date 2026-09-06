// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > INFRASTRUCTURE
// > REPRESENTATIVES_CACHE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { Utils } from '@shared-module/utils';
import type {
	CongressLegislator,
	OpenStatesPerson,
} from '@representatives-module/domain/civicUpstreamModel';
import {
	FEDERAL_LEGISLATORS_KEY,
	SEED_FRESHNESS_WINDOW_MS,
	SEEDED_VERSION_KEY,
	US_STATE_CODES,
	stateCacheKey,
} from '@representatives-module/domain/representativeConstants';
import {
	fetchFederalLegislators,
	fetchStateRosterByCode,
} from '@representatives-module/infrastructure/civicDataProviders';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const putLastGood = (
	env: WorkerEnv,
	key: string,
	value: unknown,
): Promise<void> =>
	env.REPRESENTATIVES_CACHE.put(key, JSON.stringify(value), {
		metadata: { seededAt: Date.now() },
	});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Force one fresh federal download and replace KV only when the source returns a usable roster. ---
export const fetchFreshFederalLegislators = async (
	env: WorkerEnv,
): Promise<Array<CongressLegislator>> => {
	const fresh = await fetchFederalLegislators(env);

	if (fresh.length > 0) {
		await putLastGood(env, FEDERAL_LEGISLATORS_KEY, fresh);
	}

	return fresh;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Federal: read-through KV. Miss → fetch the keyless blob, cache it. ---
export const readFederalLegislators = async (
	env: WorkerEnv,
): Promise<Array<CongressLegislator>> => {
	const cached = await env.REPRESENTATIVES_CACHE.get<
		Array<CongressLegislator>
	>(FEDERAL_LEGISLATORS_KEY, 'json');

	if (cached) {
		return cached;
	}

	const fresh = await fetchFreshFederalLegislators(env);

	return fresh;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- State roster: read-through KV by state code (cron pre-seeds these). ---
export const fetchCachedStateLegislators = (
	env: WorkerEnv,
	code: string,
): Promise<Array<OpenStatesPerson> | null> =>
	env.REPRESENTATIVES_CACHE.get<Array<OpenStatesPerson>>(
		stateCacheKey(code),
		'json',
	);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Deploy marker: which Worker version last triggered a seed (drives seed-on-new-version). ---
export const getSeededVersion = (env: WorkerEnv): Promise<string | null> =>
	env.REPRESENTATIVES_CACHE.get(SEEDED_VERSION_KEY);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const setSeededVersion = (
	env: WorkerEnv,
	versionId: string,
): Promise<void> =>
	env.REPRESENTATIVES_CACHE.put(SEEDED_VERSION_KEY, versionId);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- One list call reads every key's seededAt metadata (no blob reads), so repeat seeds skip fresh rosters. ---
const buildFreshKeySet = async (env: WorkerEnv): Promise<Set<string>> => {
	const listed = await env.REPRESENTATIVES_CACHE.list<{
		seededAt: number;
	}>();
	const now = Date.now();
	const freshKeys = new Set<string>();

	for (const key of listed.keys) {
		if (
			key.metadata &&
			now - key.metadata.seededAt < SEED_FRESHNESS_WINDOW_MS
		) {
			freshKeys.add(key.name);
		}
	}

	return freshKeys;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Cron + deploy: refresh the federal blob + every state roster, skipping anything still fresh. ---
export const seedAllStates = async (env: WorkerEnv): Promise<void> => {
	const freshKeys = await buildFreshKeySet(env);

	if (!freshKeys.has(FEDERAL_LEGISLATORS_KEY)) {
		await fetchFreshFederalLegislators(env);
	}

	for (const code of US_STATE_CODES) {
		if (freshKeys.has(stateCacheKey(code))) {
			continue;
		}

		// --- Isolate each state: one upstream throw must not abort the rest of the seed. ---
		const seedStateRosterCallback = async (): Promise<void> => {
			const roster = await fetchStateRosterByCode(env, code);

			if (roster.length > 0) {
				await putLastGood(env, stateCacheKey(code), roster);
			}
		};

		const seedStateRosterResults = await Utils.APITryCatch<void>({
			callback: seedStateRosterCallback,
			errorContext: `REPRESENTATIVES_SEED_${code}`,
		});

		if (seedStateRosterResults.error !== undefined) {
			console.error(
				`[seed ${code}] ${seedStateRosterResults.error.message}`,
			);
		}
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
