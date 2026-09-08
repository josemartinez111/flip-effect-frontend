// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > ECONOMY > FETCH_TREASURY_TARIFF_ACTIVITY_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import { Utils } from '../../../lib/utils/utils';
import { HTTP_STATUS as ST } from '../../../lib/constants/HttpStatusConstants';
import {
	TARIFF_API_URL,
	TARIFF_HISTORY_MONTHS,
	TARIFF_SOURCE_NAME,
	TARIFF_SOURCE_URL,
	TARIFF_TREASURY_TIMEOUT_MS,
} from '../../../lib/constants/TariffActivityConstants';
import type { TariffActivityActionResult } from '../../action-results/TariffActivityActionResult';
import type {
	TariffActivity,
	TariffMonth,
} from '../../models/TariffActivityModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Treasury permits credential-free browser requests. Use this only when the primary Worker cannot provide its cached snapshot. ---
export const fetchTreasuryTariffActivityAction =
	async (): Promise<TariffActivityActionResult> => {
		const fetchTreasuryTariffActivityCallback =
			async (): Promise<TariffActivity> => {
				const payload: unknown = await ky
					.get(TARIFF_API_URL, {
						timeout: TARIFF_TREASURY_TIMEOUT_MS,
						retry: 0,
						credentials: 'omit',
						searchParams: {
							filter: 'classification_desc:eq:Customs Duties',
							fields:
								'record_date,classification_desc,current_month_gross_rcpt_amt,current_month_refund_amt,current_month_net_rcpt_amt',
							sort: '-record_date',
							'page[size]': TARIFF_HISTORY_MONTHS,
						},
					})
					.json<unknown>();

				if (
					!payload ||
					typeof payload !== 'object' ||
					!('data' in payload) ||
					!Array.isArray(payload.data) ||
					payload.data.length === 0 ||
					payload.data.length > TARIFF_HISTORY_MONTHS
				) {
					throw new Error(
						'Treasury returned an invalid customs-duty dataset.',
					);
				}

				const rows: Array<unknown> = payload.data;
				const months: Array<TariffMonth> = [];
				const reportDates = new Set<string>();

				// --- Match the Worker contract without trusting external JSON. Missing amounts stay errors, never invented zero-dollar observations. ---
				for (const row of rows) {
					if (
						!row ||
						typeof row !== 'object' ||
						!('record_date' in row) ||
						typeof row.record_date !== 'string' ||
						!/^\d{4}-\d{2}-\d{2}$/.test(row.record_date) ||
						!('classification_desc' in row) ||
						row.classification_desc !== 'Customs Duties' ||
						!('current_month_gross_rcpt_amt' in row) ||
						typeof row.current_month_gross_rcpt_amt !== 'string' ||
						!('current_month_refund_amt' in row) ||
						typeof row.current_month_refund_amt !== 'string' ||
						!('current_month_net_rcpt_amt' in row) ||
						typeof row.current_month_net_rcpt_amt !== 'string'
					) {
						throw new Error(
							'Treasury returned an invalid customs-duty row.',
						);
					}

					const amounts = [
						row.current_month_gross_rcpt_amt,
						row.current_month_refund_amt,
						row.current_month_net_rcpt_amt,
					];
					const reportTimestamp = Date.parse(
						`${row.record_date}T00:00:00.000Z`,
					);
					const collected = Number(row.current_month_gross_rcpt_amt);
					const refunded = Number(row.current_month_refund_amt);
					const netReceipts = Number(row.current_month_net_rcpt_amt);

					if (
						!amounts.every((amount) => /^-?\d+(\.\d+)?$/.test(amount)) ||
						!Number.isFinite(reportTimestamp) ||
						new Date(reportTimestamp).toISOString().slice(0, 10) !==
							row.record_date ||
						reportDates.has(row.record_date) ||
						![collected, refunded, netReceipts].every(Number.isFinite) ||
						Math.abs(collected - refunded - netReceipts) > 0.02
					) {
						throw new Error(
							'Treasury returned inconsistent customs-duty observations.',
						);
					}

					reportDates.add(row.record_date);
					months.push({
						reportDate: row.record_date,
						collected,
						refunded,
						netReceipts,
					});
				}

				// --- The API returns newest first; the chart needs chronological observations in actual USD, including negative net receipts. ---
				months.sort((left, right) =>
					left.reportDate.localeCompare(right.reportDate),
				);
				const latestMonth = months.at(-1);

				if (!latestMonth) {
					throw new Error(
						'Treasury customs-duty observations are unavailable.',
					);
				}

				const snapshot: TariffActivity = {
					months,
					latestReportDate: latestMonth.reportDate,
					fetchedAt: new Date().toISOString(),
					source: TARIFF_SOURCE_NAME,
					sourceUrl: TARIFF_SOURCE_URL,
					currency: 'USD',
				};

				return snapshot;
			};
		const treasuryResults = await Utils.runTryCatch<TariffActivity>({
			callback: fetchTreasuryTariffActivityCallback,
			errorContext: 'FETCH_TREASURY_TARIFF_ACTIVITY',
			failureStatusCode: ST.SERVICE_UNAVAILABLE,
		});

		if (treasuryResults.error !== undefined) {
			const failed: TariffActivityActionResult = {
				success: false,
				statusCode: treasuryResults.statusCode,
				message: 'Tariff activity is temporarily unavailable.',
				error: treasuryResults.error.message,
			};

			return failed;
		}

		const succeeded: TariffActivityActionResult = {
			success: true,
			statusCode: treasuryResults.statusCode,
			message: 'Tariff activity loaded directly from Treasury.',
			tariffActivity: treasuryResults.result,
			isStale: false,
		};

		return succeeded;
	};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
