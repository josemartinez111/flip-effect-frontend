// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > INFRASTRUCTURE > HOUSEHOLD_PRICE_SOURCE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type {
	HouseholdPrices,
	HouseholdPriceObservation,
} from '@economy-module/domain/householdPriceModel';
import {
	HOUSEHOLD_PRICE_CSV_HEADER,
	HOUSEHOLD_PRICE_DATA_URL,
	HOUSEHOLD_PRICE_MAX_BYTES,
	HOUSEHOLD_PRICE_MAX_ROWS,
	HOUSEHOLD_PRICE_SOURCE,
	HOUSEHOLD_PRICE_SOURCE_URL,
	HOUSEHOLD_PRICE_TIMEOUT_MS,
} from '@economy-module/domain/householdPriceConstants';

export class HouseholdPriceSource {
	// --- Download the author's CSV directly, not the website markup. Bound both network time and bytes before parsing. ---
	static async fetchHouseholdPrices(): Promise<HouseholdPrices> {
		const response = await fetch(HOUSEHOLD_PRICE_DATA_URL, {
			signal: AbortSignal.timeout(HOUSEHOLD_PRICE_TIMEOUT_MS),
			redirect: 'manual',
		});

		if (!response.ok || !response.body) {
			throw new Error('The Pricing Lab download is unavailable.');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let bytesRead = 0;
		let csv = '';

		try {
			while (true) {
				const chunk = await reader.read();

				if (chunk.done) {
					break;
				}

				bytesRead += chunk.value.byteLength;

				if (bytesRead > HOUSEHOLD_PRICE_MAX_BYTES) {
					await reader.cancel();
					throw new Error(
						'The Pricing Lab download exceeded its expected size.',
					);
				}

				csv += decoder.decode(chunk.value, { stream: true });
			}
		} finally {
			reader.releaseLock();
		}

		csv += decoder.decode();
		const lines = csv
			.replace(/^\uFEFF/, '')
			.trim()
			.split(/\r?\n/);

		// --- This numeric CSV has a fixed unquoted schema. Fail visibly on schema changes rather than silently reading a different quartile. ---
		if (
			lines.shift() !== HOUSEHOLD_PRICE_CSV_HEADER ||
			lines.length < 2 ||
			lines.length > HOUSEHOLD_PRICE_MAX_ROWS
		) {
			throw new Error('The Pricing Lab CSV schema is invalid.');
		}

		const observations: Array<HouseholdPriceObservation> = [];
		let previousDate = '';

		for (const line of lines) {
			const fields = line.split(',');
			const date = fields[0] ?? '';
			const values = fields.slice(1);
			const timestamp = Date.parse(date + 'T00:00:00Z');
			const lowerPricedIndex = Number(values[0]);
			const premiumIndex = Number(values[3]);

			if (
				fields.length !== 6 ||
				!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
				!Number.isFinite(timestamp) ||
				new Date(timestamp).toISOString().slice(0, 10) !== date ||
				timestamp > Date.now() ||
				date <= previousDate ||
				!values.every(
					(value: string) =>
						/^\d+(\.\d+)?$/.test(value) &&
						Number.isFinite(Number(value)) &&
						Number(value) > 0,
				)
			) {
				throw new Error(
					'The Pricing Lab CSV contains invalid or unordered observations.',
				);
			}

			// --- Quartiles describe product prices within categories, not household incomes. Preserve source indices and normalize only in the UI. ---
			observations.push({ date, lowerPricedIndex, premiumIndex });
			previousDate = date;
		}

		const first = observations[0];
		const last = observations.at(-1);

		if (!first || !last) {
			throw new Error('The Pricing Lab history is empty.');
		}

		const snapshot: HouseholdPrices = {
			observations,
			baselineDate: first.date,
			latestObservationDate: last.date,
			fetchedAt: new Date().toISOString(),
			source: HOUSEHOLD_PRICE_SOURCE,
			sourceUrl: HOUSEHOLD_PRICE_SOURCE_URL,
			dataUrl: HOUSEHOLD_PRICE_DATA_URL,
		};

		return snapshot;
	}
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
