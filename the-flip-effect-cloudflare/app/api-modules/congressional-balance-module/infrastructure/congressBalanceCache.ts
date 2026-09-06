// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > CONGRESSIONAL-BALANCE-MODULE > INFRASTRUCTURE
// > CONGRESSIONAL_BALANCE_CACHE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import type { CongressLegislator } from '@representatives-module/domain/civicUpstreamModel';
import { FEDERAL_LEGISLATORS_KEY } from '@representatives-module/domain/representativeConstants';
import { CONGRESSIONAL_BALANCE_KEY } from '@congressional-balance-module/domain/congressionalBalanceConstants';
import type { CongressionalBalance } from '@congressional-balance-module/domain/congressionalBalanceModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type CongressBalanceCacheResult = {
	balance?: CongressionalBalance;
	legislators?: Array<CongressLegislator>;
	rosterFetchedAt?: string;
};

type FederalRosterCacheMetadata = {
	seededAt: number;
};

// --- Own every KV operation for the compact congressional balance snapshot. ---
export class CongressBalanceCache {
	// --- Read the small balance first; only read the full roster when the compact key has not been built yet. ---
	static async fetchCongressBalanceCache(
		env: WorkerEnv,
	): Promise<CongressBalanceCacheResult> {
		const balance =
			await env.REPRESENTATIVES_CACHE.get<CongressionalBalance>(
				CONGRESSIONAL_BALANCE_KEY,
				'json',
			);

		if (balance) {
			const cached: CongressBalanceCacheResult = { balance };

			return cached;
		}

		const federalRoster = await env.REPRESENTATIVES_CACHE.getWithMetadata<
			Array<CongressLegislator>,
			FederalRosterCacheMetadata
		>(FEDERAL_LEGISLATORS_KEY, 'json');
		const cached: CongressBalanceCacheResult = {
			legislators: federalRoster.value ?? undefined,
			rosterFetchedAt:
				federalRoster.metadata?.seededAt === undefined
					? undefined
					: new Date(federalRoster.metadata.seededAt).toISOString(),
		};

		return cached;
	}

	// --- Write only a successfully normalized balance, preserving the previous value on upstream failures. ---
	static cacheCongressBalance(
		env: WorkerEnv,
		balance: CongressionalBalance,
	): Promise<void> {
		const cacheWrite = env.REPRESENTATIVES_CACHE.put(
			CONGRESSIONAL_BALANCE_KEY,
			JSON.stringify(balance),
			{ metadata: { seededAt: Date.parse(balance.fetchedAt) } },
		);

		return cacheWrite;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
