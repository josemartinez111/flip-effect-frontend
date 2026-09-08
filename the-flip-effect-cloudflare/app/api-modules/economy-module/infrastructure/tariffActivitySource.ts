// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > INFRASTRUCTURE > TARIFF_ACTIVITY_SOURCE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import type {
	TariffActivity,
	TariffMonth,
} from '@economy-module/domain/tariffActivityModel';
import type { TreasuryTariffRow } from '@economy-module/domain/tariffUpstreamModel';
import {
	TARIFF_API_URL,
	TARIFF_HISTORY_MONTHS,
	TARIFF_SOURCE_NAME,
	TARIFF_SOURCE_TIMEOUT_MS,
	TARIFF_SOURCE_URL,
} from '@economy-module/domain/tariffActivityConstants';

export class TariffActivitySource {
	// --- Request only the newest monthly customs-duty rows; no API key, HTML scraping, or full-dataset download is needed. ---
	static async fetchTariffActivity(): Promise<TariffActivity> {
		const payload: unknown = await ky
			.get(TARIFF_API_URL, {
				timeout: TARIFF_SOURCE_TIMEOUT_MS,
				retry: 0,
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

		for (const row of rows) {
			if (!TariffActivitySource.fetchIsTreasuryRow(row)) {
				throw new Error('Treasury returned an invalid customs-duty row.');
			}

			const reportTimestamp = Date.parse(
				`${row.record_date}T00:00:00.000Z`,
			);
			const collected = Number(row.current_month_gross_rcpt_amt);
			const refunded = Number(row.current_month_refund_amt);
			const netReceipts = Number(row.current_month_net_rcpt_amt);

			// --- Reject malformed dates, duplicates, or inconsistent amounts rather than replacing last-good KV data with a partial snapshot. ---
			if (
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

		months.sort((left, right) =>
			left.reportDate.localeCompare(right.reportDate),
		);
		const latestMonth = months.at(-1);

		if (!latestMonth) {
			throw new Error(
				'Treasury customs-duty observations are unavailable.',
			);
		}

		const activity: TariffActivity = {
			months,
			latestReportDate: latestMonth.reportDate,
			fetchedAt: new Date().toISOString(),
			source: TARIFF_SOURCE_NAME,
			sourceUrl: TARIFF_SOURCE_URL,
			currency: 'USD',
		};

		return activity;
	}

	// --- Validate the external strings without assertions; empty strings and Treasury's "null" markers must never become zero dollars. ---
	private static fetchIsTreasuryRow(
		row: unknown,
	): row is TreasuryTariffRow {
		const valid =
			Boolean(row) &&
			typeof row === 'object' &&
			row !== null &&
			'record_date' in row &&
			typeof row.record_date === 'string' &&
			/^\d{4}-\d{2}-\d{2}$/.test(row.record_date) &&
			'classification_desc' in row &&
			row.classification_desc === 'Customs Duties' &&
			'current_month_gross_rcpt_amt' in row &&
			typeof row.current_month_gross_rcpt_amt === 'string' &&
			/^-?\d+(\.\d+)?$/.test(row.current_month_gross_rcpt_amt) &&
			'current_month_refund_amt' in row &&
			typeof row.current_month_refund_amt === 'string' &&
			/^-?\d+(\.\d+)?$/.test(row.current_month_refund_amt) &&
			'current_month_net_rcpt_amt' in row &&
			typeof row.current_month_net_rcpt_amt === 'string' &&
			/^-?\d+(\.\d+)?$/.test(row.current_month_net_rcpt_amt);

		return valid;
	}
}
