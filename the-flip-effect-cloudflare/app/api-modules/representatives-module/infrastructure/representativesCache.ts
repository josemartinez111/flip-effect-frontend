// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > INFRASTRUCTURE
// > REPRESENTATIVES_CACHE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import type {
	CongressLegislator,
	OpenStatesPerson,
} from '@representatives-module/domain/civicUpstreamModel';
import {
	CACHE_TTL_SECONDS,
	FEDERAL_LEGISLATORS_KEY,
	US_STATE_CODES,
	stateCacheKey,
} from '@representatives-module/domain/representativeConstants';
import {
	fetchFederalLegislators,
	fetchStateRosterByCode,
} from '@representatives-module/infrastructure/civicDataProviders';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const putWeekly = (env: WorkerEnv, key: string, value: unknown): Promise<void> =>
	env.REPRESENTATIVES_CACHE.put(key, JSON.stringify(value), { expirationTtl: CACHE_TTL_SECONDS });

// --- Federal: read-through KV. Miss → fetch the keyless blob, cache it. ---
export const readFederalLegislators = async (
	env: WorkerEnv,
): Promise<Array<CongressLegislator>> => {
	const cached = await env.REPRESENTATIVES_CACHE.get<Array<CongressLegislator>>(
		FEDERAL_LEGISLATORS_KEY,
		'json',
	);

	if (cached) {
		return cached;
	}

	const fresh = await fetchFederalLegislators(env);

	if (fresh.length > 0) {
		await putWeekly(env, FEDERAL_LEGISLATORS_KEY, fresh);
	}

	return fresh;
};

// --- State roster: read-through KV by state code (cron pre-seeds these). ---
export const readStateLegislators = async (
	env: WorkerEnv,
	code: string,
): Promise<Array<OpenStatesPerson>> => {
	const key = stateCacheKey(code);
	const cached = await env.REPRESENTATIVES_CACHE.get<Array<OpenStatesPerson>>(key, 'json');

	if (cached) {
		return cached;
	}

	const fresh = await fetchStateRosterByCode(env, code);

	if (fresh.length > 0) {
		await putWeekly(env, key, fresh);
	}

	return fresh;
};

// --- Weekly cron: refresh the federal blob + every state roster. ---
export const seedAllStates = async (env: WorkerEnv): Promise<void> => {
	const federal = await fetchFederalLegislators(env);

	if (federal.length > 0) {
		await putWeekly(env, FEDERAL_LEGISLATORS_KEY, federal);
	}

	for (const code of US_STATE_CODES) {
		// --- Isolate each state: one upstream throw must not abort the rest of the weekly seed. ---
		try {
			const roster = await fetchStateRosterByCode(env, code);

			if (roster.length > 0) {
				await putWeekly(env, stateCacheKey(code), roster);
			}
		} catch (error: unknown) {
			const cause = error instanceof Error ? error.message : String(error);

			console.error(`[seed ${code}] ${cause}`);
		}
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
