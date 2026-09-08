// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > INFRASTRUCTURE > TARIFF_ACTIVITY_CACHE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import type { TariffActivity } from '@economy-module/domain/tariffActivityModel';
import { TARIFF_CACHE_KEY } from '@economy-module/domain/tariffActivityConstants';

// --- Reuse the existing namespace with a feature-specific key; no new Cloudflare resource is required. ---
export class TariffActivityCache {
	static async fetchTariffCache(
		env: WorkerEnv,
	): Promise<TariffActivity | null> {
		const snapshot = await env.REPRESENTATIVES_CACHE.get<TariffActivity>(
			TARIFF_CACHE_KEY,
			'json',
		);

		return snapshot;
	}

	// --- Intentionally omit expiration: a missed release or upstream outage must not erase the last real amounts. ---
	static async fetchWriteTariffCache(
		env: WorkerEnv,
		snapshot: TariffActivity,
	): Promise<void> {
		await env.REPRESENTATIVES_CACHE.put(
			TARIFF_CACHE_KEY,
			JSON.stringify(snapshot),
		);
	}
}
