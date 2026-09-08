<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
COMPONENTS: PAGES > AMERICA-IN-FOCUS > HOUSEHOLD-PRICES
> TARIFF_MONEY_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { useId } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import FWTTrendChartCard from '../../../shared/trend-chart-card/FWTTrendChartCard.vue';
import Show from '../../../utils/Show.vue';
import { UseTariffActivityComposable } from '../america-in-focus-page-composables/UseTariffActivityComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	tariffMoneyCards,
	tariffPeriodLabel,
	tariffRefundShare,
	tariffNetReceipts,
	tariffStatusLabel,
	tariffEmptyMessage,
	tariffSourceCaption,
	tariffSourceUrl,
	tariffSourceTooltip,
} = UseTariffActivityComposable();
const sourceTooltipId = useId();
const contextHeadingId = useId();
const totalsStyleClasses = twMerge(
	clsx(
		'font-montserrat mt-5 rounded-2xl border border-slate-950/10 bg-white/90 p-5 tablet:p-7',
		'text-base leading-relaxed text-slate-700 tablet:text-lg dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-300',
	),
);
// --- Montserrat keeps currency glyphs readable; tabular figures align values without changing the display-heading font. ---
const moneyValueStyleClasses = twMerge(
	clsx(
		'font-montserrat text-4xl font-bold tracking-tight tabular-nums tablet:text-5xl',
	),
);
// --- Keep source caveats together before the plots, rather than interrupting the visual comparison between them. ---
const contextCardStyleClasses = twMerge(
	clsx(
		'font-montserrat mb-6 rounded-3xl border border-slate-950/10 bg-white/90 p-5 shadow-sm tablet:p-7',
		'text-base leading-relaxed text-slate-700 tablet:text-lg dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-300',
	),
);
const sourceLinkStyleClasses = twMerge(
	clsx(
		'font-montserrat inline-block cursor-pointer rounded py-2 text-base font-semibold leading-relaxed',
		'text-blue-700 underline decoration-blue-700/40 underline-offset-4 tablet:text-lg',
		'hover:decoration-current focus-visible:outline-2 dark:text-blue-300 dark:decoration-blue-300/40',
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
	<section aria-label="Customs collections and refunds" class="mb-8">
		<!-- ∞∞∞∞∞∞∞∞ CONTEXT AND SOURCE BEFORE THE GRAPHS ∞∞∞∞∞∞∞∞ -->
		<aside
			:class="contextCardStyleClasses"
			:aria-labelledby="contextHeadingId"
		>
			<h3
				:id="contextHeadingId"
				class="tablet:text-2xl text-xl font-bold text-slate-950 dark:text-slate-100"
				>Reading these graphs</h3
			>
			<div class="laptop:grid-cols-2 laptop:gap-8 mt-4 grid gap-4">
				<p>
					Treasury-reported figures, not independently audited here. All
					customs duties; recipient companies are not identified.
				</p>
				<p>
					Government receipts are not a measure of household savings. The
					research below tracks prices instead, over its own published
					period.
				</p>
			</div>
			<Show :when="tariffSourceCaption">
				<div
					class="group relative mt-5 border-t border-slate-950/10 pt-3 dark:border-white/10"
				>
					<a
						:href="tariffSourceUrl"
						:aria-describedby="sourceTooltipId"
						target="_blank"
						rel="noopener noreferrer"
						:class="sourceLinkStyleClasses"
						>{{ tariffSourceCaption }}</a
					>
					<span
						:id="sourceTooltipId"
						role="tooltip"
						:class="sourceTooltipStyleClasses"
						>{{ tariffSourceTooltip }}</span
					>
				</div>
			</Show>
		</aside>
		<!-- ∞∞∞∞∞∞∞∞ TWO MONEY FLOWS, SEPARATE SCALES ∞∞∞∞∞∞∞∞ -->
		<p
			class="tablet:text-lg mb-3 text-base text-slate-700 dark:text-slate-300"
		>
			Monthly Treasury figures · Separate dollar scales
		</p>
		<div class="laptop:grid-cols-2 grid min-w-0 gap-5">
			<FWTTrendChartCard
				v-for="(card, index) in tariffMoneyCards"
				:key="card.title"
				:title="card.title"
				:description="card.description"
				:data="card.data"
				chart-type="bar"
				unit-label="USD per month"
				:value-format="{
					style: 'currency',
					currency: 'USD',
					notation: 'compact',
					maximumFractionDigits: 2,
				}"
				:show-table="false"
				:status-label="tariffStatusLabel"
				:empty-message="tariffEmptyMessage"
				chart-height-classes="h-64 tablet:h-72"
			>
				<template #summary>
					<Show :when="tariffPeriodLabel">
						<div class="mt-6">
							<p
								:class="
									twMerge(
										moneyValueStyleClasses,
										index === 0
											? 'text-blue-700 dark:text-blue-300'
											: 'text-orange-700 dark:text-orange-300',
									)
								"
								>{{ card.latestAmount }}</p
							>
							<p class="mt-2 text-base text-slate-600 dark:text-slate-400"
								>Latest reported month</p
							>
						</div>
					</Show>
				</template>
			</FWTTrendChartCard>
		</div>
		<!-- ∞∞∞∞∞∞∞∞ SAME-WINDOW TOTALS ∞∞∞∞∞∞∞∞ -->
		<Show :when="tariffPeriodLabel">
			<div :class="totalsStyleClasses">
				<p class="font-semibold">Displayed period</p>
				<p
					class="tablet:text-2xl mt-1 text-xl font-bold text-slate-950 dark:text-slate-100"
					>{{ tariffPeriodLabel }}</p
				>
				<dl class="tablet:grid-cols-2 my-6 grid gap-6">
					<div>
						<dt class="font-semibold">Refunds ÷ collections</dt>
						<dd
							class="tablet:text-4xl mt-2 text-3xl font-bold text-orange-700 tabular-nums dark:text-orange-300"
							>{{ tariffRefundShare }}</dd
						>
					</div>
					<div>
						<dt class="font-semibold">Net receipts</dt>
						<dd
							class="tablet:text-4xl mt-2 text-3xl font-bold text-blue-700 tabular-nums dark:text-blue-300"
							>{{ tariffNetReceipts }}</dd
						>
					</div>
				</dl>
				<p class="border-t border-slate-950/10 pt-4 dark:border-white/10"
					>Period totals, not a matched refund rate. Refunds may relate to
					earlier collections.</p
				>
			</div>
		</Show>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
