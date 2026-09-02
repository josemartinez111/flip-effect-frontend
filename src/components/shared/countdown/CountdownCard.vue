<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > COUNTDOWN
    > COUNTDOWN_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import Card from 'primevue/card';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { twMerge } from 'tailwind-merge';
import { Utils } from '../../../lib';
import Show from '../../utils/Show.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type CountdownCardDetails = {
	title: string;
	targetDate: Date | string;
};

type CountdownCardProps = CountdownCardDetails & {
	variant?: 'primary' | 'compact';
	showChildCard?: boolean;
	childCountdown?: CountdownCardDetails;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const {
	title,
	targetDate,
	variant = 'primary',
	showChildCard = false,
	childCountdown,
} = defineProps<CountdownCardProps>();

let countdownIntervalId: number | undefined;

const countdown = ref(Utils.getCountdownTimeLeft({ targetDate }));

const countdownDateLabel = computed((): string =>
	Utils.formatDate('date', targetDate),
);

// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const countdownContainerStyleClasses = computed(() =>
	twMerge(
		clsx('flex flex-col items-center', {
			'relative z-30 w-28 tablet:w-38 laptop:absolute laptop:left-8 laptop:top-4 laptop:w-48':
				variant === 'primary',
			'mt-2 w-24 tablet:mt-3 tablet:w-32 laptop:w-40':
				variant === 'compact',
		}),
	),
);

const countdownCardStyleClasses = computed(() =>
	twMerge(
		clsx(
			'w-full overflow-hidden rounded-xl',
			'border border-white/18 bg-slate-950/42 text-white shadow-2xl',
			'shadow-slate-950/25 backdrop-blur-md',
			'dark:border-white/12 dark:bg-slate-950/38 dark:shadow-black/45',
			{
				'h-40 tablet:h-56 laptop:h-72': variant === 'primary',
				'h-28 tablet:h-36 laptop:h-44': variant === 'compact',
			},
		),
	),
);

const countdownCardBodyStyleClasses = twMerge(clsx('h-full p-0'));

const countdownCardContentStyleClasses = computed(() =>
	twMerge(
		clsx(
			'flex h-full flex-col items-center justify-center font-orbitron text-center',
			{
				'px-2 py-3 tablet:px-3 tablet:py-4': variant === 'primary',
				'px-1.5 py-2 tablet:px-2 tablet:py-2.5': variant === 'compact',
			},
		),
	),
);

const countdownEyebrowStyleClasses = computed(() =>
	twMerge(
		clsx(
			'font-black uppercase text-cyan-100',
			'drop-shadow-[0_0_8px_rgba(125,211,252,0.7)]',
			{
				'text-[0.55rem] tracking-[0.16em] tablet:text-[0.68rem] laptop:text-xs':
					variant === 'primary',
				'text-[0.42rem] leading-tight tracking-[0.12em] tablet:text-[0.52rem] laptop:text-[0.62rem]':
					variant === 'compact',
			},
		),
	),
);

const countdownDaysValueStyleClasses = computed(() =>
	twMerge(
		clsx(
			'bg-gradient-to-b from-white via-cyan-100 to-sky-300',
			'bg-clip-text font-black leading-none text-transparent',
			'drop-shadow-[0_0_16px_rgba(56,189,248,0.9)]',
			{
				'mt-2 text-4xl tablet:mt-4 tablet:text-6xl laptop:text-7xl':
					variant === 'primary',
				'mt-1 text-2xl tablet:mt-2 tablet:text-3xl laptop:text-4xl':
					variant === 'compact',
			},
		),
	),
);

const countdownDaysLabelStyleClasses = computed(() =>
	twMerge(
		clsx('mt-1 font-black uppercase text-white/82', {
			'text-[0.6rem] tracking-[0.22em] tablet:text-xs':
				variant === 'primary',
			'text-[0.42rem] tracking-[0.16em] tablet:text-[0.52rem]':
				variant === 'compact',
		}),
	),
);

const countdownTimeGridStyleClasses = computed(() =>
	twMerge(
		clsx('grid w-full grid-cols-3 border-y border-white/16', {
			'mt-3 gap-1 py-2 tablet:mt-5 tablet:gap-2 tablet:py-3':
				variant === 'primary',
			'mt-1.5 gap-0.5 py-1 tablet:mt-2 tablet:gap-1 tablet:py-1.5':
				variant === 'compact',
		}),
	),
);

const countdownTimeValueStyleClasses = computed(() =>
	twMerge(
		clsx(
			'block font-black leading-none text-white',
			'drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]',
			{
				'text-sm tablet:text-xl laptop:text-2xl': variant === 'primary',
				'text-[0.62rem] tablet:text-xs laptop:text-sm':
					variant === 'compact',
			},
		),
	),
);

const countdownTimeLabelStyleClasses = computed(() =>
	twMerge(
		clsx('block font-bold uppercase text-cyan-100/78', {
			'mt-1 text-[0.45rem] tracking-[0.12em] tablet:text-[0.55rem]':
				variant === 'primary',
			'mt-0.5 text-[0.32rem] tracking-[0.08em] tablet:text-[0.4rem]':
				variant === 'compact',
		}),
	),
);

const countdownDateLabelStyleClasses = computed(() =>
	twMerge(
		clsx('max-w-full font-bold leading-tight text-white/66', {
			'mt-2 text-[0.48rem] tablet:mt-4 tablet:text-[0.62rem] laptop:text-[0.68rem]':
				variant === 'primary',
			'mt-1 text-[0.38rem] tablet:mt-2 tablet:text-[0.46rem] laptop:text-[0.52rem]':
				variant === 'compact',
		}),
	),
);

const syncCountdown = (): void => {
	countdown.value = Utils.getCountdownTimeLeft({ targetDate });
};

onMounted(() => {
	syncCountdown();
	countdownIntervalId = window.setInterval(syncCountdown, 1000);
});

onUnmounted(() => {
	if (countdownIntervalId !== undefined) {
		window.clearInterval(countdownIntervalId);
		countdownIntervalId = undefined;
	}
});
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div :class="countdownContainerStyleClasses">
		<Card
			unstyled
			:class="countdownCardStyleClasses"
			:pt="{
				body: { class: countdownCardBodyStyleClasses },
				content: { class: countdownCardContentStyleClasses },
			}"
		>
			<template #content>
				<div :class="countdownEyebrowStyleClasses">{{ title }}</div>

				<div :class="countdownDaysValueStyleClasses">
					{{ countdown.days }}
				</div>

				<div :class="countdownDaysLabelStyleClasses">
					{{ countdown.days === 1 ? 'Day' : 'Days' }}
				</div>

				<div :class="countdownTimeGridStyleClasses">
					<div>
						<span :class="countdownTimeValueStyleClasses">
							{{ Utils.formatCountdownUnit(countdown.hours) }}
						</span>
						<span :class="countdownTimeLabelStyleClasses">Hrs</span>
					</div>

					<div>
						<span :class="countdownTimeValueStyleClasses">
							{{ Utils.formatCountdownUnit(countdown.minutes) }}
						</span>
						<span :class="countdownTimeLabelStyleClasses">Min</span>
					</div>

					<div>
						<span :class="countdownTimeValueStyleClasses">
							{{ Utils.formatCountdownUnit(countdown.seconds) }}
						</span>
						<span :class="countdownTimeLabelStyleClasses">Sec</span>
					</div>
				</div>

				<div :class="countdownDateLabelStyleClasses">
					{{ countdownDateLabel }}
				</div>
			</template>
		</Card>

		<Show :when="showChildCard && childCountdown">
			<template #default="{ value: childCard }">
				<CountdownCard
					:title="childCard.title"
					:target-date="childCard.targetDate"
					variant="compact"
				/>
			</template>
		</Show>
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
