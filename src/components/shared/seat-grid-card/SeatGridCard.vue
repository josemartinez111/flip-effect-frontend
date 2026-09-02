<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > SEAT-GRID-CARD
    > SEAT_GRID_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import clsx from 'clsx';
import Card from 'primevue/card';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
import FWTSeatAvatar from '../FWTSeatAvatar.vue';
import {
	type SeatGridCardLayout,
	type SeatGridCardModel,
} from './SeatGridCardTypes.ts';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const { seatGridCard } = defineProps<{
	seatGridCard: SeatGridCardModel;
}>();

const seatGridCardStyleClasses = twMerge(
	clsx(
		'overflow-hidden rounded-xl border bg-transparent shadow-xl',
		'border-slate-900/8 shadow-slate-950/12',
		'dark:border-white/10 dark:shadow-black/35',
	),
);

const seatGridCardBodyStyleClasses = twMerge(clsx('p-0'));

const seatGridCardContentStyleClasses = twMerge(
	clsx(
		'bg-gradient-to-br from-white/72 via-white/54 to-slate-200/50 p-4',
		'dark:from-slate-950/84 dark:via-slate-900/68 dark:to-slate-950/84',
		'tablet:p-5',
	),
);

const seatGridCardHeaderStyleClasses = twMerge(
	clsx('mb-4 flex items-start justify-between gap-3'),
);

const seatGridCardTitleStyleClasses = twMerge(
	clsx(
		'font-orbitron text-lg font-black uppercase tracking-[0.08em]',
		'text-slate-950 dark:text-white',
	),
);

const seatGridCardStatusStyleClasses = twMerge(
	clsx(
		'rounded-md border px-2 py-1 font-orbitron text-[0.62rem] font-black',
		'uppercase tracking-[0.16em]',
		'border-rose-500/25 bg-rose-500/12 text-rose-700',
		'dark:border-rose-300/22 dark:bg-rose-400/12 dark:text-rose-200',
	),
);

const seatGridCardSummaryStyleClasses = twMerge(
	clsx(
		'space-y-1 text-sm font-bold leading-6 text-slate-700',
		'dark:text-slate-200/82',
	),
);

const seatGridCardHighlightStyleClasses = twMerge(
	clsx('text-cyan-700 dark:text-cyan-100'),
);

const seatGridCardBarsStyleClasses = twMerge(clsx('mt-4 space-y-3'));

const seatGridCardBarRowStyleClasses = twMerge(
	clsx('grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-3'),
);

const seatGridCardBarLabelStyleClasses = twMerge(
	clsx(
		'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.12em]',
		'text-slate-600 dark:text-slate-300/82',
	),
);

const seatGridCardProgressStyleClasses = twMerge(
	clsx(
		'h-2 w-full appearance-none overflow-hidden rounded-full',
		'bg-slate-950/10 shadow-[inset_0_1px_4px_rgba(15,23,42,0.18)]',
		'dark:bg-white/10 dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.45)]',
		'[&::-webkit-progress-bar]:bg-inherit',
		'[&::-webkit-progress-value]:rounded-full',
		'[&::-webkit-progress-value]:bg-gradient-to-r',
		'[&::-moz-progress-bar]:rounded-full',
		'[&::-moz-progress-bar]:bg-gradient-to-r',
	),
);

const seatGridCardBarCountStyleClasses = twMerge(
	clsx(
		'text-right font-orbitron text-xs font-black',
		'text-slate-700 dark:text-slate-100',
	),
);

const seatGridCardMetadataStyleClasses = twMerge(
	clsx(
		'mt-4 flex flex-wrap gap-2 font-orbitron text-[0.62rem] font-bold',
		'uppercase tracking-[0.12em]',
	),
);

const seatGridCardMetadataItemStyleClasses = twMerge(
	clsx(
		'rounded-md border px-2 py-1',
		'border-slate-900/10 bg-white/48 text-slate-700',
		'dark:border-white/10 dark:bg-white/6 dark:text-slate-200/78',
	),
);

const seatGridStyleClassesByLayout: Record<SeatGridCardLayout, string> = {
	dense: twMerge(
		clsx(
			'grid-cols-[repeat(29,minmax(0,1fr))]',
			'tablet:grid-cols-[repeat(35,minmax(0,1fr))]',
		),
	),
	standard: twMerge(
		clsx(
			'grid-cols-[repeat(20,minmax(0,1fr))]',
			'tablet:grid-cols-[repeat(25,minmax(0,1fr))]',
		),
	),
	spacious: twMerge(
		clsx(
			'grid-cols-[repeat(8,minmax(0,1fr))]',
			'tablet:grid-cols-[repeat(12,minmax(0,1fr))]',
		),
	),
};

const seatGridStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'mt-5 grid content-start justify-items-center gap-x-1.5 gap-y-2',
			'rounded-xl border p-3',
			'border-slate-950/8 bg-slate-950/6',
			'dark:border-white/8 dark:bg-black/18',
			seatGridStyleClassesByLayout[seatGridCard.layout],
		),
	);
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Card
		unstyled
		:class="seatGridCardStyleClasses"
		:pt="{
			body: { class: seatGridCardBodyStyleClasses },
			content: { class: seatGridCardContentStyleClasses },
		}"
	>
		<template #content>
			<div :class="seatGridCardHeaderStyleClasses">
				<div>
					<h3 :class="seatGridCardTitleStyleClasses">
						{{ seatGridCard.title }}
					</h3>

					<div :class="seatGridCardSummaryStyleClasses">
						<p>{{ seatGridCard.summary }}</p>
						<p :class="seatGridCardHighlightStyleClasses">
							{{ seatGridCard.highlight }}
						</p>
					</div>
				</div>

				<span :class="seatGridCardStatusStyleClasses">
					{{ seatGridCard.statusLabel }}
				</span>
			</div>

			<div :class="seatGridCardBarsStyleClasses">
				<div
					v-for="bar in seatGridCard.bars"
					:key="bar.key"
					:class="seatGridCardBarRowStyleClasses"
				>
					<span :class="seatGridCardBarLabelStyleClasses">
						{{ bar.label }}
					</span>
					<progress
						:class="[seatGridCardProgressStyleClasses, bar.styleClasses]"
						:value="Math.min(100, Math.max(0, bar.percentage))"
						max="100"
					>
						{{ bar.percentage }}%
					</progress>
					<span :class="seatGridCardBarCountStyleClasses">
						{{ bar.count }}
					</span>
				</div>
			</div>

			<div :class="seatGridCardMetadataStyleClasses">
				<span
					v-for="metadataItem in seatGridCard.metadata"
					:key="metadataItem.key"
					:class="seatGridCardMetadataItemStyleClasses"
				>
					{{ metadataItem.label }}
				</span>
			</div>

			<div
				:class="seatGridStyleClasses"
				:aria-label="seatGridCard.seatGridAriaLabel"
				role="group"
			>
				<FWTSeatAvatar
					v-for="seat in seatGridCard.seats"
					:key="seat.id"
					:seat-avatar-size="seatGridCard.seatAvatarSize"
					:aria-label="seat.ariaLabel"
					v-bind="seat.styleClasses"
				/>
			</div>
		</template>
	</Card>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
