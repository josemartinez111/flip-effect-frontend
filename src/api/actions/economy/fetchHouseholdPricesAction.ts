// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API > ACTIONS > ECONOMY > FETCH_HOUSEHOLD_PRICES_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import { GlobalEnvs } from '../../../lib/constants/GlobalEnvs';
import { HTTP_STATUS as ST } from '../../../lib/constants/HttpStatusConstants';
import { Utils } from '../../../lib/utils/utils';
import {
	HOUSEHOLD_PRICE_DATA_URL,
	HOUSEHOLD_PRICE_SOURCE_URL,
	HOUSEHOLD_PRICE_REQUEST_TIMEOUT_MS,
	HOUSEHOLD_PRICE_MAX_OBSERVATIONS,
	HOUSEHOLD_PRICE_CACHE_WINDOW_MS,
} from '../../../lib/constants/HouseholdPriceConstants';
import type { HouseholdPriceActionResult } from '../../action-results/HouseholdPriceActionResult';
import type {
	HouseholdPrices,
	HouseholdPriceObservation,
} from '../../models/HouseholdPriceModel';

// --- Harvard does not enable browser CORS. Consume only our validated Worker snapshot, never silently fall back to Treasury dollars. ---
export const fetchHouseholdPricesAction =
	async (): Promise<HouseholdPriceActionResult> => {
		const fetchHouseholdPricesCallback =
			async (): Promise<HouseholdPrices> => {
				const workerUrl = GlobalEnvs.CivicWorkerUrl.replace(/\/+$/, '');
				const response = await ky.get(
					workerUrl + '/api/economy/household-prices',
					{
						timeout: HOUSEHOLD_PRICE_REQUEST_TIMEOUT_MS,
						retry: 0,
						throwHttpErrors: false,
					},
				);
				const payload: unknown = await response.json();

				if (
					!response.ok ||
					!payload ||
					typeof payload !== 'object' ||
					!('success' in payload) ||
					payload.success !== true ||
					!('householdPrices' in payload)
				) {
					throw new Error(
						'The household-price endpoint is unavailable. Check that the updated Worker is deployed.',
					);
				}

				const snapshot = payload.householdPrices;

				// --- Reject old deployments, invalid indices, and untrusted source links before anything reaches the store. ---
				if (
					!snapshot ||
					typeof snapshot !== 'object' ||
					!('observations' in snapshot) ||
					!Array.isArray(snapshot.observations) ||
					snapshot.observations.length < 2 ||
					snapshot.observations.length >
						HOUSEHOLD_PRICE_MAX_OBSERVATIONS ||
					!('baselineDate' in snapshot) ||
					typeof snapshot.baselineDate !== 'string' ||
					!('latestObservationDate' in snapshot) ||
					typeof snapshot.latestObservationDate !== 'string' ||
					!('fetchedAt' in snapshot) ||
					typeof snapshot.fetchedAt !== 'string' ||
					!Number.isFinite(Date.parse(snapshot.fetchedAt)) ||
					!('source' in snapshot) ||
					typeof snapshot.source !== 'string' ||
					!('sourceUrl' in snapshot) ||
					snapshot.sourceUrl !== HOUSEHOLD_PRICE_SOURCE_URL ||
					!('dataUrl' in snapshot) ||
					snapshot.dataUrl !== HOUSEHOLD_PRICE_DATA_URL ||
					!snapshot.observations.every(
						(
							observation: unknown,
						): observation is HouseholdPriceObservation => {
							if (
								!observation ||
								typeof observation !== 'object' ||
								!('date' in observation) ||
								typeof observation.date !== 'string' ||
								!/^\d{4}-\d{2}-\d{2}$/.test(observation.date)
							) {
								return false;
							}

							const dateTimestamp = Date.parse(
								observation.date + 'T00:00:00Z',
							);

							return (
								Number.isFinite(dateTimestamp) &&
								new Date(dateTimestamp).toISOString().slice(0, 10) ===
									observation.date &&
								'lowerPricedIndex' in observation &&
								typeof observation.lowerPricedIndex === 'number' &&
								Number.isFinite(observation.lowerPricedIndex) &&
								observation.lowerPricedIndex > 0 &&
								'premiumIndex' in observation &&
								typeof observation.premiumIndex === 'number' &&
								Number.isFinite(observation.premiumIndex) &&
								observation.premiumIndex > 0
							);
						},
					)
				) {
					throw new Error(
						'The Worker returned an invalid household-price snapshot.',
					);
				}

				const observations = snapshot.observations;

				if (
					observations[0]?.date !== snapshot.baselineDate ||
					observations.at(-1)?.date !== snapshot.latestObservationDate ||
					!observations.every(
						(observation: HouseholdPriceObservation, index: number) =>
							index === 0 ||
							observation.date > (observations[index - 1]?.date ?? ''),
					)
				) {
					throw new Error(
						'The household-price observation dates are inconsistent.',
					);
				}

				const result: HouseholdPrices = {
					observations: snapshot.observations,
					baselineDate: snapshot.baselineDate,
					latestObservationDate: snapshot.latestObservationDate,
					fetchedAt: snapshot.fetchedAt,
					source: snapshot.source,
					sourceUrl: snapshot.sourceUrl,
					dataUrl: snapshot.dataUrl,
				};

				return result;
			};
		const priceResults = await Utils.runTryCatch<HouseholdPrices>({
			callback: fetchHouseholdPricesCallback,
			errorContext: 'FETCH_HOUSEHOLD_PRICES',
			failureStatusCode: ST.SERVICE_UNAVAILABLE,
		});

		if (priceResults.error !== undefined) {
			const failed: HouseholdPriceActionResult = {
				success: false,
				statusCode: priceResults.statusCode,
				message: 'Household price data is temporarily unavailable.',
				error: priceResults.error.message,
			};

			return failed;
		}

		const succeeded: HouseholdPriceActionResult = {
			success: true,
			statusCode: priceResults.statusCode,
			message: 'Household prices loaded.',
			householdPrices: priceResults.result,
			isStale:
				Date.now() - Date.parse(priceResults.result.fetchedAt) >=
				HOUSEHOLD_PRICE_CACHE_WINDOW_MS,
		};

		return succeeded;
	};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
