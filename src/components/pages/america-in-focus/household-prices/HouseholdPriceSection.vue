<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
COMPONENTS: PAGES > AMERICA-IN-FOCUS > HOUSEHOLD-PRICES
> HOUSEHOLD_PRICE_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { useId } from 'vue';
import { ExternalLink } from '@lucide/vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import FWTTrendChartCard from '../../../shared/trend-chart-card/FWTTrendChartCard.vue';
import Show from '../../../utils/Show.vue';
import TariffMoneySection from './TariffMoneySection.vue';
import { UseHouseholdPriceComposable } from '../america-in-focus-page-composables/UseHouseholdPriceComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	priceChartData,
	priceSummaryRows,
	priceDescription,
	priceStatusLabel,
	priceEmptyMessage,
	priceSourceCaption,
	priceSourceUrl,
	priceDataUrl,
} = UseHouseholdPriceComposable();
const sourceTooltipId = useId();
const storyHeadingId = useId();
const summaryTableId = useId();
const summaryStyleClasses = twMerge(
	clsx(
		'mt-4 overflow-x-auto rounded-xl border border-slate-950/10 bg-white/90 p-4',
		'text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-300',
	),
);
const sourceLinkStyleClasses = twMerge(
	clsx(
		'inline-block cursor-pointer rounded text-sm text-slate-700 underline underline-offset-4',
		'focus-visible:outline-2 dark:text-slate-300',
	),
);
// --- Keep CSV navigation a real link, with the same clear hit area and feedback as an app button. ---
const sourceCsvButtonStyleClasses = twMerge(
	clsx(
		'font-orbitron inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg',
		'border border-orange-600 bg-brand-orange px-4 py-3 text-xs font-bold text-slate-950 shadow-sm',
		'transition-colors hover:bg-orange-400 active:bg-orange-500',
		'focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:outline-none',
		'dark:ring-offset-slate-950 motion-reduce:transition-none',
	),
);
// --- The fixed two-row order follows the chart: blue lower-priced goods, then orange premium goods. ---
const summaryRowStyleClasses = twMerge(
	clsx(
		'border-b border-slate-950/10 odd:bg-brand-blue/10 even:bg-brand-orange/10 last:border-0',
		'dark:border-white/10 dark:odd:bg-transparent dark:even:bg-transparent',
	),
);
const sourceTooltipStyleClasses = twMerge(
	clsx(
		'invisible absolute bottom-full left-0 z-50 mb-2 w-80 max-w-full rounded-xl',
		'border border-white/25 bg-slate-950 px-4 py-3 text-sm leading-relaxed text-white shadow-xl',
		'group-hover:visible group-focus-within:visible',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :aria-labelledby="storyHeadingId">
		<!-- ∞∞∞∞∞∞∞∞ MONEY FLOWS AND CHECKOUT PRICES ∞∞∞∞∞∞∞∞ -->
		<header class="mb-6 text-slate-950 dark:text-slate-100">
			<h2
				:id="storyHeadingId"
				class="font-orbitron tablet:text-3xl text-2xl font-bold"
				>Tariffs &amp; Your Wallet</h2
			>
			<p class="tablet:text-base mt-3 text-sm"
				>What came in, what went back, and what happened to prices?</p
			>
		</header>
		<TariffMoneySection />
		<!-- ∞∞∞∞∞∞∞∞ LOWER-PRICED VERSUS PREMIUM GOODS ∞∞∞∞∞∞∞∞ -->
		<FWTTrendChartCard
			title="Prices at checkout"
			:description="priceDescription"
			:data="priceChartData"
			unit-label="Change since baseline"
			:value-format="{
				style: 'percent',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}"
			:show-table="false"
			:status-label="priceStatusLabel"
			:empty-message="priceEmptyMessage"
			:aria-describedby="
				priceSummaryRows.length ? summaryTableId : undefined
			"
		/>
		<!-- ∞∞∞∞∞∞∞∞ SAME PERIOD COMPARISON ∞∞∞∞∞∞∞∞ -->
		<Show :when="priceSummaryRows.length">
			<div :class="summaryStyleClasses">
				<table :id="summaryTableId" class="w-full text-left tabular-nums">
					<caption class="mb-3 text-left font-semibold"
						>Price changes in tracked imported goods</caption
					>
					<thead>
						<tr
							class="border-b border-current/15 bg-slate-100 text-slate-950 dark:bg-white/5 dark:text-slate-200"
						>
							<th scope="col" class="px-3 py-2">Product group</th>
							<th scope="col" class="px-3 py-2 whitespace-nowrap"
								>First observation</th
							>
							<th scope="col" class="px-3 py-2 whitespace-nowrap"
								>Latest observation</th
							>
							<th scope="col" class="px-3 py-2 whitespace-nowrap"
								>Price change</th
							>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="row in priceSummaryRows"
							:key="row.label"
							:class="summaryRowStyleClasses"
						>
							<th scope="row" class="px-3 py-3 font-medium">{{
								row.label
							}}</th>
							<td class="px-3 py-3 whitespace-nowrap">{{
								row.startDate
							}}</td>
							<td class="px-3 py-3 whitespace-nowrap">{{
								row.endDate
							}}</td>
							<td class="px-3 py-3 font-semibold whitespace-nowrap">
								<span
									class="inline-block rounded-md bg-white/80 px-3 py-1 text-slate-950 dark:bg-white/10 dark:text-slate-100"
									>{{ row.change }}</span
								>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Show>
		<!-- ∞∞∞∞∞∞∞∞ RESEARCH LIMITATION AND SOURCE ∞∞∞∞∞∞∞∞ -->
		<p
			class="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
		>
			Published retail-price research—not total household costs or proof
			that tariffs caused every price change.
		</p>
		<Show :when="priceSourceCaption">
			<div class="mt-3 flex flex-wrap items-center gap-3">
				<div class="group relative max-w-full">
					<a
						:href="priceSourceUrl"
						:aria-describedby="sourceTooltipId"
						target="_blank"
						rel="noopener noreferrer"
						:class="sourceLinkStyleClasses"
						>{{ priceSourceCaption }}</a
					>
					<span
						:id="sourceTooltipId"
						role="tooltip"
						:class="sourceTooltipStyleClasses"
					>
						HBS Pricing Lab / Cavallo, Llamas &amp; Vazquez. Published
						indices for the lowest- and highest-priced quartiles of
						imported products within categories, grouped using pre-tariff
						prices. Prices are collected by PriceStats from major
						retailers. These are product-price groups, not household income
						groups. Each line shows change from its own index value on the
						same starting date.
					</span>
				</div>
				<a
					:href="priceDataUrl"
					target="_blank"
					rel="noopener noreferrer"
					:class="sourceCsvButtonStyleClasses"
				>
					View source CSV
					<ExternalLink class="size-4 shrink-0" aria-hidden="true" />
				</a>
			</div>
		</Show>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
