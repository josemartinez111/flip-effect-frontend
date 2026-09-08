// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > APPLICATION > TARIFF_ACTIVITY_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { Utils } from '@shared-module/utils';
import { STATUS } from '@shared-module/httpStatus';
import type {
	TariffActivity,
	TariffActivityActionResult,
} from '@economy-module/domain/tariffActivityModel';
import { TARIFF_FRESH_WINDOW_MS } from '@economy-module/domain/tariffActivityConstants';
import { TariffActivityCache } from '@economy-module/infrastructure/tariffActivityCache';
import { TariffActivitySource } from '@economy-module/infrastructure/tariffActivitySource';

export class TariffActivityService {
	// --- Cached reads return immediately. Stale reads refresh in the background while retaining their original reporting and fetch dates. ---
	static async fetchTariffActivity(
		env: WorkerEnv,
		ctx: Pick<ExecutionContext, 'waitUntil'>,
	): Promise<TariffActivityActionResult> {
		const fetchTariffActivityCallback =
			async (): Promise<TariffActivityActionResult> => {
				const cached = await TariffActivityCache.fetchTariffCache(env);

				if (cached) {
					const isStale =
						!Number.isFinite(Date.parse(cached.fetchedAt)) ||
						Date.now() - Date.parse(cached.fetchedAt) >=
							TARIFF_FRESH_WINDOW_MS;

					if (isStale) {
						ctx.waitUntil(
							TariffActivityService.fetchCronsTariffActivity(env),
						);
					}

					const hit: TariffActivityActionResult = {
						success: true,
						statusCode: STATUS.OK,
						message: 'Tariff activity loaded.',
						tariffActivity: cached,
						isStale,
					};

					return hit;
				}

				const fresh = await TariffActivitySource.fetchTariffActivity();
				// --- A failed KV write should not hide a valid first response; the next request can retry the read-through. ---
				ctx.waitUntil(
					TariffActivityService.fetchCacheTariffActivity(env, fresh),
				);
				const succeeded: TariffActivityActionResult = {
					success: true,
					statusCode: STATUS.OK,
					message: 'Tariff activity loaded.',
					tariffActivity: fresh,
					isStale: false,
				};

				return succeeded;
			};
		const tariffResults =
			await Utils.APITryCatch<TariffActivityActionResult>({
				callback: fetchTariffActivityCallback,
				errorContext: 'FETCH_TARIFF_ACTIVITY',
				failureStatusCode: STATUS.SERVICE_UNAVAILABLE,
			});

		if (tariffResults.error !== undefined) {
			console.error(`[tariff activity] ${tariffResults.error.message}`);
			const failed: TariffActivityActionResult = {
				success: false,
				statusCode: tariffResults.statusCode,
				message: 'Tariff activity is temporarily unavailable.',
				error: 'The Treasury snapshot could not be loaded.',
			};

			return failed;
		}

		return tariffResults.result;
	}

	// --- The daily job always fetches fresh data; failure leaves the existing KV entry untouched. ---
	static async fetchCronsTariffActivity(env: WorkerEnv): Promise<void> {
		const fetchFreshTariffActivityCallback = async (): Promise<void> => {
			const snapshot = await TariffActivitySource.fetchTariffActivity();
			await TariffActivityCache.fetchWriteTariffCache(env, snapshot);
		};
		const refreshResults = await Utils.APITryCatch<void>({
			callback: fetchFreshTariffActivityCallback,
			errorContext: 'FETCH_CRONS_TARIFF_ACTIVITY',
		});

		if (refreshResults.error !== undefined) {
			console.error(
				`[tariff activity cron] ${refreshResults.error.message}`,
			);
		}
	}

	// --- Contain background persistence errors separately from the successful HTTP response. ---
	private static async fetchCacheTariffActivity(
		env: WorkerEnv,
		snapshot: TariffActivity,
	): Promise<void> {
		const fetchCacheTariffActivityCallback = async (): Promise<void> => {
			await TariffActivityCache.fetchWriteTariffCache(env, snapshot);
		};
		const cacheResults = await Utils.APITryCatch<void>({
			callback: fetchCacheTariffActivityCallback,
			errorContext: 'CACHE_TARIFF_ACTIVITY',
		});

		if (cacheResults.error !== undefined) {
			console.error(
				`[tariff activity cache] ${cacheResults.error.message}`,
			);
		}
	}
}
