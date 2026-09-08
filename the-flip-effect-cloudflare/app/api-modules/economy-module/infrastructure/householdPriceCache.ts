// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > INFRASTRUCTURE > HOUSEHOLD_PRICE_CACHE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import type { HouseholdPrices } from '@economy-module/domain/householdPriceModel';
import { HOUSEHOLD_PRICE_CACHE_KEY } from '@economy-module/domain/householdPriceConstants';

// --- Retain last-good history in the existing namespace, independently of the Treasury cache. ---
export class HouseholdPriceCache {
	static async fetchHouseholdPriceCache(
		env: WorkerEnv,
	): Promise<HouseholdPrices | null> {
		const snapshot = await env.REPRESENTATIVES_CACHE.get<HouseholdPrices>(
			HOUSEHOLD_PRICE_CACHE_KEY,
			'json',
		);

		return snapshot;
	}

	static async fetchWriteHouseholdPriceCache(
		env: WorkerEnv,
		snapshot: HouseholdPrices,
	): Promise<void> {
		const previous =
			await HouseholdPriceCache.fetchHouseholdPriceCache(env);

		if (
			previous &&
			snapshot.latestObservationDate < previous.latestObservationDate
		) {
			throw new Error(
				'The Pricing Lab download would move the published history backward.',
			);
		}

		// --- No expiration: an outage must not erase research, and its real observation date remains visible. ---
		await env.REPRESENTATIVES_CACHE.put(
			HOUSEHOLD_PRICE_CACHE_KEY,
			JSON.stringify(snapshot),
		);
	}
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
