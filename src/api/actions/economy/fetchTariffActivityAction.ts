// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > ECONOMY > FETCH_TARIFF_ACTIVITY_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import { GlobalEnvs } from '../../../lib/constants/GlobalEnvs';
import { HTTP_STATUS as ST } from '../../../lib/constants/HttpStatusConstants';
import { Utils } from '../../../lib/utils/utils';
import { TARIFF_WORKER_TIMEOUT_MS } from '../../../lib/constants/TariffActivityConstants';
import { fetchTreasuryTariffActivityAction } from './fetchTreasuryTariffActivityAction';
import type { TariffActivityActionResult } from '../../action-results/TariffActivityActionResult';

// --- Prefer the compact KV response. If the Worker cannot reach Treasury, recover through its public browser-enabled API without changing the UI contract. ---
export const fetchTariffActivityAction =
	async (): Promise<TariffActivityActionResult> => {
		const fetchTariffActivityCallback =
			async (): Promise<TariffActivityActionResult> => {
				const workerUrl = GlobalEnvs.CivicWorkerUrl.replace(/\/+$/, '');
				const response = await ky.get(`${workerUrl}/api/economy/tariffs`, {
					throwHttpErrors: false,
					retry: 0,
					timeout: TARIFF_WORKER_TIMEOUT_MS,
				});
				const actionResult =
					await response.json<TariffActivityActionResult>();

				if (!response.ok || actionResult.success !== true) {
					const failed: TariffActivityActionResult = {
						success: false,
						statusCode: ST.SERVICE_UNAVAILABLE,
						message:
							actionResult.message ||
							'Tariff activity is temporarily unavailable.',
						error: actionResult.error || 'The tariff request failed.',
					};

					return failed;
				}

				// --- Detect a deployment/contract mismatch here so malformed data cannot enter the shared store. ---
				const snapshot = actionResult.tariffActivity;

				if (
					!snapshot ||
					!Array.isArray(snapshot.months) ||
					snapshot.months.length === 0 ||
					snapshot.currency !== 'USD' ||
					!Number.isFinite(Date.parse(snapshot.latestReportDate)) ||
					!Number.isFinite(Date.parse(snapshot.fetchedAt)) ||
					typeof snapshot.source !== 'string' ||
					typeof snapshot.sourceUrl !== 'string' ||
					typeof actionResult.isStale !== 'boolean' ||
					!snapshot.months.every(
						(month) =>
							month &&
							Number.isFinite(Date.parse(month.reportDate)) &&
							typeof month.collected === 'number' &&
							Number.isFinite(month.collected) &&
							typeof month.refunded === 'number' &&
							Number.isFinite(month.refunded) &&
							typeof month.netReceipts === 'number' &&
							Number.isFinite(month.netReceipts),
					)
				) {
					throw new Error(
						'The Worker returned an invalid tariff activity response.',
					);
				}

				return actionResult;
			};
		const tariffResults =
			await Utils.runTryCatch<TariffActivityActionResult>({
				callback: fetchTariffActivityCallback,
				errorContext: 'FETCH_TARIFF_ACTIVITY',
				failureStatusCode: ST.SERVICE_UNAVAILABLE,
			});

		if (
			tariffResults.error === undefined &&
			tariffResults.result.success
		) {
			return tariffResults.result;
		}

		// --- HTTP failures, malformed JSON, and timeouts all reach the same fallback; only a failure of both paths surfaces in the card. ---
		return fetchTreasuryTariffActivityAction();
	};
