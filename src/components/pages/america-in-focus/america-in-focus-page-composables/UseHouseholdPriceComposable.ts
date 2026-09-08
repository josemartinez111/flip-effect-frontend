// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS > PAGES > AMERICA-IN-FOCUS > AMERICA-IN-FOCUS-PAGE-COMPOSABLES > USE_HOUSEHOLD_PRICE_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useHouseholdPriceStore } from '../../../../lib/stores/UseHouseholdPriceStore';
import type { HouseholdPriceSummaryRow } from '../../../../lib/types/HouseholdPricePresentationTypes';
import type { TrendChartData } from '../../../shared/trend-chart-card/TrendChartCardTypes';

// --- Own the household question and its display math; the generic chart stays independent of Harvard and network requests. ---
export const UseHouseholdPriceComposable = () => {
	const priceStore = useHouseholdPriceStore();
	const { householdPrices, isLoading, isStale, errorMessage } =
		storeToRefs(priceStore);
	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeZone: 'UTC',
	});
	const percentFormatter = new Intl.NumberFormat('en-US', {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		signDisplay: 'exceptZero',
	});
	const priceChartData = computed<TrendChartData>(() => {
		const observations = householdPrices.value?.observations ?? [];
		const baseline = observations[0];
		const chartData: TrendChartData = {
			labels: observations.map((observation) =>
				dateFormatter.format(new Date(observation.date + 'T00:00:00Z')),
			),
			datasets: [
				{
					label: 'Lower-priced imported goods',
					// --- Rebase both groups on the same first date. Intl percent formatting expects fractions: 0.05 means 5%, not 500%. ---
					data: observations.map((observation) =>
						baseline
							? observation.lowerPricedIndex / baseline.lowerPricedIndex -
								1
							: null,
					),
					pointRadius: 0,
				},
				{
					label: 'Premium imported goods',
					data: observations.map((observation) =>
						baseline
							? observation.premiumIndex / baseline.premiumIndex - 1
							: null,
					),
					pointRadius: 0,
				},
			],
		};

		return chartData;
	});
	const priceSummaryRows = computed<Array<HouseholdPriceSummaryRow>>(
		() => {
			const snapshot = householdPrices.value;
			const first = snapshot?.observations[0];
			const last = snapshot?.observations.at(-1);

			if (!snapshot || !first || !last) {
				return [];
			}

			const startDate = dateFormatter.format(
				new Date(first.date + 'T00:00:00Z'),
			);
			const endDate = dateFormatter.format(
				new Date(last.date + 'T00:00:00Z'),
			);
			const rows: Array<HouseholdPriceSummaryRow> = [
				{
					label: 'Lower-priced imported goods',
					startDate,
					endDate,
					change: percentFormatter.format(
						last.lowerPricedIndex / first.lowerPricedIndex - 1,
					),
				},
				{
					label: 'Premium imported goods',
					startDate,
					endDate,
					change: percentFormatter.format(
						last.premiumIndex / first.premiumIndex - 1,
					),
				},
			];

			return rows;
		},
	);
	const priceDescription = computed(() => {
		const date = householdPrices.value?.baselineDate;
		const baseline = date
			? dateFormatter.format(new Date(date + 'T00:00:00Z'))
			: 'the first published observation';

		return (
			'Are lower-priced imported goods rising faster than premium goods? Compare cumulative price changes since ' +
			baseline +
			'.'
		);
	});
	const priceStatusLabel = computed(() => {
		const snapshot = householdPrices.value;

		if (!snapshot) {
			return isLoading.value
				? 'Loading price research'
				: 'Research unavailable';
		}

		// --- Daily cache checks do not create new observations. Always identify this as a historical series with the source's actual ending date. ---
		const date = dateFormatter.format(
			new Date(snapshot.latestObservationDate + 'T00:00:00Z'),
		);

		return (
			(isStale.value ? 'Cached · ' : '') + 'Historical · Through ' + date
		);
	});
	const priceEmptyMessage = computed(() =>
		isLoading.value
			? 'Loading published price observations…'
			: (errorMessage.value ?? 'No price observations available.'),
	);
	const priceSourceCaption = computed(() => {
		const snapshot = householdPrices.value;

		if (!snapshot) {
			return '';
		}

		return (
			snapshot.source +
			' · Checked ' +
			dateFormatter.format(new Date(snapshot.fetchedAt)) +
			' (UTC)'
		);
	});
	const priceSourceUrl = computed(
		() => householdPrices.value?.sourceUrl ?? '',
	);
	const priceDataUrl = computed(
		() => householdPrices.value?.dataUrl ?? '',
	);

	onMounted(async () => {
		await priceStore.fetchHouseholdPrices();
	});
	const householdPricePresentation = {
		priceChartData,
		priceSummaryRows,
		priceDescription,
		priceStatusLabel,
		priceEmptyMessage,
		priceSourceCaption,
		priceSourceUrl,
		priceDataUrl,
	};

	return householdPricePresentation;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
