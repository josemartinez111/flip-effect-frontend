// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: SHARED > TREND-CHART-CARD > TREND_CHART_CARD_TYPES.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { ChartData } from 'chart.js';

export type TrendChartType = 'line' | 'bar';
export type TrendChartData = ChartData<
	TrendChartType,
	Array<number | null>,
	string
>;

export type TrendChartCardProps = {
	title: string;
	description?: string;
	data?: TrendChartData;
	chartType?: TrendChartType;
	filled?: boolean;
	unitLabel?: string;
	locale?: string;
	valueFormat?: Intl.NumberFormatOptions;
	showTable?: boolean;
	tableTitle?: string;
	periodLabel?: string;
	statusLabel?: string;
	emptyMessage?: string;
	chartHeightClasses?: string;
};

export type TrendChartRow = {
	period: string;
	values: Array<number | null>;
};

// --- Getters preserve destructured Vue prop reactivity without copying parent-owned data into local state. ---
export type TrendChartComposableOptions = {
	data: () => TrendChartData;
	chartType: () => TrendChartType;
	filled: () => boolean;
	valueFormat: () => Intl.NumberFormatOptions;
	locale: () => string;
	unitLabel: () => string;
	isDark?: () => boolean;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
