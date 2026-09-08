// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: SHARED > TREND-CHART-CARD > USE_TREND_CHART_CARD_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed } from 'vue';
import type { ChartOptions } from 'chart.js';
import type {
	TrendChartComposableOptions,
	TrendChartData,
	TrendChartRow,
	TrendChartType,
} from './TrendChartCardTypes';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Adapt native Chart.js inputs into one consistent chart/table view; this composable never fetches data. ---
export const UseTrendChartCardComposable = ({
	data,
	chartType,
	filled,
	valueFormat,
	locale,
	unitLabel,
	isDark = () => false,
}: TrendChartComposableOptions) => {
	const numberFormatter = computed(
		() => new Intl.NumberFormat(locale(), valueFormat()),
	);
	const formatValue = (value: number | null | undefined): string => {
		if (value === null || value === undefined || !Number.isFinite(value)) {
			return '—';
		}

		return numberFormatter.value.format(value);
	};

	const chartData = computed<TrendChartData>(() => {
		const source = data();
		const labels = source.labels ?? [];
		const theme =
			typeof document === 'undefined'
				? undefined
				: getComputedStyle(document.documentElement);
		const defaultColors = [
			theme?.getPropertyValue('--color-brand-blue').trim() || '#3b82f6',
			theme?.getPropertyValue('--color-brand-orange').trim() || '#f97316',
			theme?.getPropertyValue('--color-brand-teal').trim() || '#14b8a6',
			theme?.getPropertyValue('--color-brand-purple').trim() || '#7c3aed',
		];
		const normalized: TrendChartData = {
			labels: [...labels],
			datasets: source.datasets.map((dataset, index) => {
				const color = defaultColors[index % defaultColors.length];
				const series: TrendChartData['datasets'][number] = {
					borderColor: color,
					backgroundColor: color,
					borderWidth: 2,
					pointRadius: 3,
					pointHoverRadius: 5,
					tension: 0,
					fill: chartType() === 'line' && filled(),
					...dataset,
					// --- Missing observations stay gaps, not invented zeros; extra values cannot outlive their labels. ---
					data: labels.map((_, position) => {
						const value = dataset.data[position];

						return typeof value === 'number' && Number.isFinite(value)
							? value
							: null;
					}),
				};

				return series;
			}),
		};

		return normalized;
	});

	const hasData = computed(() =>
		chartData.value.datasets.some((dataset) =>
			dataset.data.some((value) => value !== null),
		),
	);
	const tableRows = computed<Array<TrendChartRow>>(() => {
		const rows = (chartData.value.labels ?? []).map((period, index) => {
			const row: TrendChartRow = {
				period,
				values: chartData.value.datasets.map(
					(dataset) => dataset.data[index] ?? null,
				),
			};

			return row;
		});

		return rows;
	});

	// --- Canvas colors require Chart.js options, not CSS classes. Recompute them with the existing theme store. ---
	const chartOptions = computed<ChartOptions<TrendChartType>>(() => {
		const formatter = numberFormatter.value;
		const textColor = isDark() ? '#cbd5e1' : '#475569';
		const gridColor = isDark() ? '#ffffff14' : '#0f172a14';
		const options: ChartOptions<TrendChartType> = {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			interaction: { mode: 'index', intersect: false },
			plugins: {
				legend: {
					labels: { color: textColor, usePointStyle: true, padding: 24 },
				},
				tooltip: {
					callbacks: {
						label: (context) =>
							`${context.dataset.label ?? ''}: ${formatValue(context.parsed.y)}`,
					},
				},
			},
			scales: {
				x: {
					ticks: { color: textColor, maxRotation: 0 },
					grid: { display: false },
				},
				y: {
					beginAtZero: true,
					grid: { color: gridColor },
					title: {
						display: Boolean(unitLabel()),
						text: unitLabel(),
						color: textColor,
					},
					ticks: {
						color: textColor,
						callback: (value) => formatter.format(Number(value)),
					},
				},
			},
		};

		return options;
	});

	const trendChartCard = {
		chartData,
		chartOptions,
		hasData,
		tableRows,
		formatValue,
	};

	return trendChartCard;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
