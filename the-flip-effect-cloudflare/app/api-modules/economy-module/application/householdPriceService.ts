// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > APPLICATION > HOUSEHOLD_PRICE_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { Utils } from '@shared-module/utils';
import { STATUS } from '@shared-module/httpStatus';
import type {
	HouseholdPrices,
	HouseholdPriceActionResult,
} from '@economy-module/domain/householdPriceModel';
import { HOUSEHOLD_PRICE_FRESH_WINDOW_MS } from '@economy-module/domain/householdPriceConstants';
import { HouseholdPriceCache } from '@economy-module/infrastructure/householdPriceCache';
import { HouseholdPriceSource } from '@economy-module/infrastructure/householdPriceSource';

export class HouseholdPriceService {
	// --- Cached reads return immediately. Stale reads refresh in the background while retaining their original reporting and fetch dates. ---
	static async fetchHouseholdPrices(
		env: WorkerEnv,
		ctx: Pick<ExecutionContext, 'waitUntil'>,
	): Promise<HouseholdPriceActionResult> {
		const fetchHouseholdPriceCallback =
			async (): Promise<HouseholdPriceActionResult> => {
				const cached =
					await HouseholdPriceCache.fetchHouseholdPriceCache(env);

				if (cached) {
					const isStale =
						!Number.isFinite(Date.parse(cached.fetchedAt)) ||
						Date.now() - Date.parse(cached.fetchedAt) >=
							HOUSEHOLD_PRICE_FRESH_WINDOW_MS;

					if (isStale) {
						ctx.waitUntil(
							HouseholdPriceService.fetchCronsHouseholdPrice(env),
						);
					}

					const hit: HouseholdPriceActionResult = {
						success: true,
						statusCode: STATUS.OK,
						message: 'Household prices loaded.',
						householdPrices: cached,
						isStale,
					};

					return hit;
				}

				const fresh = await HouseholdPriceSource.fetchHouseholdPrices();
				// --- A failed KV write should not hide a valid first response; the next request can retry the read-through. ---
				ctx.waitUntil(
					HouseholdPriceService.fetchCacheHouseholdPrice(env, fresh),
				);
				const succeeded: HouseholdPriceActionResult = {
					success: true,
					statusCode: STATUS.OK,
					message: 'Household prices loaded.',
					householdPrices: fresh,
					isStale: false,
				};

				return succeeded;
			};
		const priceResults =
			await Utils.APITryCatch<HouseholdPriceActionResult>({
				callback: fetchHouseholdPriceCallback,
				errorContext: 'FETCH_HOUSEHOLD_PRICES',
				failureStatusCode: STATUS.SERVICE_UNAVAILABLE,
			});

		if (priceResults.error !== undefined) {
			console.error(`[household prices] ${priceResults.error.message}`);
			const failed: HouseholdPriceActionResult = {
				success: false,
				statusCode: priceResults.statusCode,
				message: 'Household price data is temporarily unavailable.',
				error: 'The Pricing Lab snapshot could not be loaded.',
			};

			return failed;
		}

		return priceResults.result;
	}

	// --- The daily job always fetches fresh data; failure leaves the existing KV entry untouched. ---
	static async fetchCronsHouseholdPrice(env: WorkerEnv): Promise<void> {
		const fetchFreshHouseholdPriceCallback = async (): Promise<void> => {
			const snapshot = await HouseholdPriceSource.fetchHouseholdPrices();
			await HouseholdPriceCache.fetchWriteHouseholdPriceCache(
				env,
				snapshot,
			);
		};
		const refreshResults = await Utils.APITryCatch<void>({
			callback: fetchFreshHouseholdPriceCallback,
			errorContext: 'FETCH_CRONS_HOUSEHOLD_PRICES',
		});

		if (refreshResults.error !== undefined) {
			console.error(
				`[household prices cron] ${refreshResults.error.message}`,
			);
		}
	}

	// --- Contain background persistence errors separately from the successful HTTP response. ---
	private static async fetchCacheHouseholdPrice(
		env: WorkerEnv,
		snapshot: HouseholdPrices,
	): Promise<void> {
		const fetchCacheHouseholdPriceCallback = async (): Promise<void> => {
			await HouseholdPriceCache.fetchWriteHouseholdPriceCache(
				env,
				snapshot,
			);
		};
		const cacheResults = await Utils.APITryCatch<void>({
			callback: fetchCacheHouseholdPriceCallback,
			errorContext: 'CACHE_HOUSEHOLD_PRICES',
		});

		if (cacheResults.error !== undefined) {
			console.error(
				`[household prices cache] ${cacheResults.error.message}`,
			);
		}
	}
}
