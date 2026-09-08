<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > TREND-CHART-CARD
    > FWT_TREND_CHART_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, useId } from 'vue';
import { storeToRefs } from 'pinia';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Show from '../../utils/Show.vue';
import { UseDarkmodeStore } from '../../../lib/stores/UseDarkmodeStore';
import { UseTrendChartCardComposable } from './UseTrendChartCardComposable';
import type { TrendChartCardProps } from './TrendChartCardTypes';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

/**
 * A reusable line/area or bar chart with an optional table of the same observations.
 * Only title is required. No source is fetched and an omitted data prop renders an empty card.
 *
 * Single series: chartData = { labels: ['Jan', 'Feb'], datasets: [{ label: 'Orders', data: [12, 18] }] }.
 * Multiple series: add more datasets; every data array follows the same labels, with null for missing values.
 * <FWTTrendChartCard title="Order history" :data="chartData" />
 * <FWTTrendChartCard title="Monthly totals" :data="chartData" chart-type="bar" :show-table="false" />
 *
 * Use filled for an area chart; dataset borderColor/backgroundColor override the default palette.
 * valueFormat uses Intl.NumberFormat options, e.g. { style: 'currency', currency: 'USD' }.
 * Percent formatting expects fractions (0.033 displays as 3.3%), not percentage points.
 * chartHeightClasses accepts literal Tailwind height classes; root class customizes the card itself.
 * Optional #summary slot adds a headline value or context between the heading and plot.
 * <FWTTrendChartCard title="Orders" :data="chartData"><template #summary>Latest: 18 orders</template></FWTTrendChartCard>
 *
 * PrimeVue API: https://primevue.org/chart/#api (type, data, options, canvasProps).
 * Dataset options: https://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
 * Table API: https://primevue.org/datatable/#api (value and Column field/header).
 */
const {
	title,
	description = '',
	data = { labels: [], datasets: [] },
	chartType = 'line',
	filled = false,
	unitLabel = '',
	locale = 'en-US',
	valueFormat = {},
	showTable = true,
	tableTitle = 'Data breakdown',
	periodLabel = 'Period',
	statusLabel = '',
	emptyMessage = 'No observations available yet.',
	chartHeightClasses = 'h-72 tablet:h-96',
} = defineProps<TrendChartCardProps>();

const headingId = useId();
const tableHeadingId = useId();
const { isDarkMode } = storeToRefs(UseDarkmodeStore());
const { chartData, chartOptions, hasData, tableRows, formatValue } =
	UseTrendChartCardComposable({
		data: () => data,
		chartType: () => chartType,
		filled: () => filled,
		valueFormat: () => valueFormat,
		locale: () => locale,
		unitLabel: () => unitLabel,
		isDark: () => isDarkMode.value,
	});

const cardStyleClasses = twMerge(
	clsx(
		'w-full overflow-hidden rounded-3xl border border-slate-950/10 bg-white/90 p-5 shadow-xl',
		'text-slate-950 tablet:p-8 dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100',
	),
);
const chartShellStyleClasses = computed(() =>
	twMerge(clsx('relative mt-7 w-full min-w-0', chartHeightClasses)),
);
const emptyGridStyleClasses = twMerge(
	clsx(
		'absolute inset-0 grid grid-rows-6 overflow-hidden rounded-xl border border-slate-950/10',
		'bg-slate-50 dark:border-white/10 dark:bg-slate-900/50',
	),
);
const tableHeaderStyleClasses = twMerge(
	clsx(
		'border-b border-slate-950/10 bg-slate-100 px-4 py-3 text-left text-sm font-semibold whitespace-nowrap',
		'dark:border-white/10 dark:bg-slate-900 dark:text-slate-200',
	),
);
const tableCellStyleClasses = twMerge(
	clsx(
		'border-b border-slate-950/8 px-4 py-3 text-sm tabular-nums whitespace-nowrap',
		'dark:border-white/8',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="cardStyleClasses" :aria-labelledby="headingId">
		<!-- ∞∞∞∞∞∞∞∞ CHART HEADING ∞∞∞∞∞∞∞∞ -->
		<header class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h2
					:id="headingId"
					class="font-orbitron tablet:text-2xl text-xl font-bold"
					>{{ title }}</h2
				>
				<Show :when="description">
					<p
						class="tablet:text-base mt-2 max-w-3xl text-sm dark:text-slate-300"
						>{{ description }}</p
					>
				</Show>
			</div>
			<Show :when="statusLabel">
				<span
					class="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold dark:text-cyan-200"
					>{{ statusLabel }}</span
				>
			</Show>
		</header>
		<!-- ∞∞∞∞∞∞∞∞ OPTIONAL HEADLINE SUMMARY ∞∞∞∞∞∞∞∞ -->
		<slot name="summary" />

		<!-- ∞∞∞∞∞∞∞∞ RESPONSIVE TREND PLOT ∞∞∞∞∞∞∞∞ -->
		<div :class="chartShellStyleClasses">
			<Show :when="hasData">
				<Chart
					:type="chartType"
					:data="chartData"
					:options="chartOptions"
					class="h-full w-full cursor-pointer"
					:canvas-props="{
						class: 'cursor-pointer',
						role: 'img',
						'aria-label': title,
						'aria-describedby': showTable ? tableHeadingId : undefined,
					}"
				/>
				<template #fallback>
					<div :class="emptyGridStyleClasses" aria-hidden="true">
						<div
							v-for="line in 6"
							:key="line"
							class="border-b last:border-0 dark:border-white/6"
						/>
					</div>
					<div
						class="relative flex h-full items-center justify-center p-6 text-center"
					>
						<p
							class="rounded-xl px-5 py-4 text-sm dark:bg-slate-950/95 dark:text-slate-300"
							>{{ emptyMessage }}</p
						>
					</div>
				</template>
			</Show>
		</div>

		<!-- ∞∞∞∞∞∞∞∞ OBSERVATION AMOUNTS ∞∞∞∞∞∞∞∞ -->
		<Show :when="showTable">
			<div class="mt-7 border-t pt-6 dark:border-white/10">
				<h3 :id="tableHeadingId" class="mb-4 text-base font-semibold">{{
					tableTitle
				}}</h3>
				<DataTable
					unstyled
					:value="tableRows"
					:pt="{
						tableContainer: { class: 'overflow-x-auto' },
						table: { class: 'w-full', 'aria-labelledby': tableHeadingId },
					}"
				>
					<template #empty
						><span class="block py-5 text-sm dark:text-slate-400">{{
							emptyMessage
						}}</span></template
					>
					<Column
						:field="'period'"
						:header="periodLabel"
						:pt="{
							headerCell: { class: tableHeaderStyleClasses },
							bodyCell: { class: tableCellStyleClasses },
						}"
					/>
					<Column
						v-for="(dataset, index) in chartData.datasets"
						:key="index"
						:field="`values.${index}`"
						:header="dataset.label ?? `Series ${index + 1}`"
						:pt="{
							headerCell: { class: tableHeaderStyleClasses },
							bodyCell: { class: tableCellStyleClasses },
						}"
					>
						<template #body="{ data: row }">{{
							formatValue(row.values[index])
						}}</template>
					</Column>
				</DataTable>
			</div>
		</Show>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
