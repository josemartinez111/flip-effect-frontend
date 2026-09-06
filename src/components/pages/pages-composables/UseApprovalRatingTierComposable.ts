// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > PAGES_COMPOSABLES
// > USE_APPROVAL_RATING_TIER_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { storeToRefs } from 'pinia';
import { twMerge } from 'tailwind-merge';
import { computed, ref, watch } from 'vue';
import {
	UsaApprovalMapTier1,
	UsaApprovalMapTier2,
	UsaApprovalMapTier3,
	UsaApprovalMapTier4,
	UsaApprovalMapTier5,
} from '../../../assets';
import { UseAnimatedPercentageComposable } from '../../../lib';
import { useApprovalStore } from '../../../lib/stores/UseApprovalStore.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type ApprovalRatingTierMap = {
	minEconomyApprovalRating: number;
	image: string;
	alt: string;
	badgeHeadline: string;
	badgeDescription: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// TODO: Replace these static values with two separate polling API actions.
// The Trump approval action should feed the avatar card, and the economy
// approval action should feed this tier map. When wired, compare/cache the
// source timestamps so both UI pieces stay in sync even though the calls differ.
// ---
export const currentTrumpApprovalRatingPercentage = 31;
export const currentTrumpEconomyApprovalPercentage = 33;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseApprovalRatingTierComposable = () => {
	const APPROVAL_RATING_TIER_STEP_DELAY_MS = 5400;
	const APPROVAL_RATING_TIER_FINAL_SETTLE_DELAY_MS = 800;
	const APPROVAL_RATING_FINAL_DROP_DELAY_MS = 7600;

	const economyApprovalRatingPercentage = ref(
		currentTrumpEconomyApprovalPercentage,
	);

	// --- Live economy approval from the Worker (AP-NORC); the static value stands in until it lands. ---
	const approvalStore = useApprovalStore();
	const { economyRating } = storeToRefs(approvalStore);

	watch(
		economyRating,
		(rating) => {
			if (rating) {
				economyApprovalRatingPercentage.value = rating.approve;
			}
		},
		{ immediate: true },
	);

	// --- Hover caption: where the economy % comes from + when the Worker last pulled it. ---
	const economyApprovalSourceCaption = computed(() => {
		const rating = economyRating.value;

		if (!rating) {
			return 'Source: AP-NORC';
		}

		const updatedOn = new Date(rating.fetchedAt).toLocaleDateString();

		return `Source: ${rating.source} · updated ${updatedOn}`;
	});

	const activeApprovalRatingTierIndex = ref(0);
	const approvalRatingTierTimeoutIds: number[] = [];

	// --- Each tier describes what the economy number means before the final API action exists. ---
	const approvalRatingTierMaps: Array<ApprovalRatingTierMap> = [
		{
			minEconomyApprovalRating: 45, image: UsaApprovalMapTier1, alt: 'Approval tier one map',
			badgeHeadline: 'Economy still gives cover',
			badgeDescription:
				'Above 45%, Republicans can still argue voters trust Trump on prices, jobs, and household costs.',
		},
		{
			minEconomyApprovalRating: 40, image: UsaApprovalMapTier2, alt: 'Approval tier two map',
			badgeHeadline: 'Cost pressure breaks through',
			badgeDescription:
				'Near 40%, inflation, gas, groceries, and rent stop being background noise and become campaign liabilities.',
		},
		{
			minEconomyApprovalRating: 35, image: UsaApprovalMapTier3, alt: 'Approval tier three map',
			badgeHeadline: 'Swing districts start slipping',
			badgeDescription:
				'In the mid-30s, voters are not just unhappy with prices; they start blaming the party in power.',
		},
		{
			minEconomyApprovalRating: 28, image: UsaApprovalMapTier4, alt: 'Approval tier four map',
			badgeHeadline: 'House majority exposed',
			badgeDescription:
				'At 33%, Quinnipiac shows voters rejecting Trump on the economy, putting vulnerable Republicans on defense.',
		},
		{
			minEconomyApprovalRating: 0, image: UsaApprovalMapTier5, alt: 'Approval tier five map',
			badgeHeadline: 'Economic collapse territory',
			badgeDescription:
				'Below 28%, the economy becomes a ballot-wide anchor: debt, prices, layoffs, and trust all hit at once.',
		},
	];

	const getApprovalRatingTierIndex = (approvalRatingPercentage: number) => {
		const tierIndex = approvalRatingTierMaps.findIndex((tierMap) => {
			return approvalRatingPercentage >= tierMap.minEconomyApprovalRating;
		});

		return tierIndex === -1 ? approvalRatingTierMaps.length - 1 : tierIndex;
	};

	const getApprovalRatingTierResolveDelayMs = (
		approvalRatingTierIndex: number,
	) => {
		if (approvalRatingTierIndex === 0) {
			return 0;
		}

		return (
			approvalRatingTierIndex * APPROVAL_RATING_TIER_STEP_DELAY_MS +
			APPROVAL_RATING_TIER_FINAL_SETTLE_DELAY_MS
		);
	};

	const targetApprovalRatingTierIndex = computed(() => {
		return getApprovalRatingTierIndex(economyApprovalRatingPercentage.value);
	});

	// --- The percentage animation resolves when the map tier resolves, so text and image stay aligned. ---
	const {
		animatedPercentage: animatedApprovalRatingPercentage,
		startAnimatedPercentage: startApprovalRatingPercentageAnimation,
		stopAnimatedPercentage: stopApprovalRatingPercentageAnimation,
	} = UseAnimatedPercentageComposable({
		initialPercentage: 100,
		targetPercentage: economyApprovalRatingPercentage,
		getPercentageAnimationSteps: (targetPercentage) => {
			const targetTierResolveDelayMs = getApprovalRatingTierResolveDelayMs(
				getApprovalRatingTierIndex(targetPercentage),
			);

			return [
				{ fromPercentage: 100, toPercentage: 90, delayMs: 300, durationMs: 3600, easing: 'easeInOutSine' },
				{ fromPercentage: 90, toPercentage: 95, delayMs: 3300, durationMs: 1300, easing: 'easeOutCubic' },
				{ fromPercentage: 95, toPercentage: 85, delayMs: 4700, durationMs: 3200, easing: 'easeInOutSine' },
				{
					fromPercentage: 85,
					toPercentage: targetPercentage,
					delayMs: APPROVAL_RATING_FINAL_DROP_DELAY_MS,
					durationMs: Math.max(
						targetTierResolveDelayMs -
							APPROVAL_RATING_FINAL_DROP_DELAY_MS,
						1600,
					),
					easing: 'easeInQuart',
				},
			];
		},
	});

	const activeApprovalRatingTierMap = computed(() => approvalRatingTierMaps[activeApprovalRatingTierIndex.value]);

	// --- Page-owned class constants stay here because the tier section is a custom homepage surface. ---
	const approvalTierCompositionStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto w-[min(98vw,100rem)]',
			'overflow-visible bg-transparent px-4 pb-6 pt-2',
			'tablet:px-6 tablet:pb-8 tablet:pt-3',
			'laptop:-mt-60 laptop:pb-6 laptop:pt-14',
		),
	);

	const approvalTierSectionStyleClasses = twMerge(
		clsx(
			'relative overflow-visible',
			'laptop:origin-top laptop:scale-[0.70]',
		),
	);

	const approvalTierViewportStyleClasses = twMerge(
		clsx(
			'relative aspect-[3/2] w-full overflow-hidden',
			'bg-white/[0.03] backdrop-blur-[2px]',
			'shadow-[0_14px_30px_rgba(15,23,42,0.06),inset_0_14px_24px_rgba(255,255,255,0.34),inset_0_-16px_26px_rgba(15,23,42,0.03)]',
			'dark:bg-transparent dark:shadow-[0_0_28px_rgba(14,165,233,0.24),inset_0_0_34px_rgba(2,6,23,0.62)]',
			'[clip-path:polygon(2%_13%,10%_5%,18%_10%,28%_3%,41%_8%,52%_2%,63%_9%,76%_4%,88%_12%,97%_7%,94%_23%,99%_39%,95%_54%,98%_72%,90%_84%,82%_96%,70%_90%,58%_98%,45%_92%,35%_99%,24%_90%,13%_96%,5%_82%,9%_66%,1%_51%,7%_35%)]',
		),
	);

	const approvalTierImageStyleClasses = twMerge(
		clsx(
			'absolute inset-0 w-full h-full object-cover object-center',
			'transition-[opacity,transform,filter] duration-[3200ms] ease-out',
			'tablet:p-8 laptop:p-10',
		),
	);

	const approvalTierEdgeStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute inset-0 z-20',
			'[clip-path:polygon(2%_13%,10%_5%,18%_10%,28%_3%,41%_8%,52%_2%,63%_9%,76%_4%,88%_12%,97%_7%,94%_23%,99%_39%,95%_54%,98%_72%,90%_84%,82%_96%,70%_90%,58%_98%,45%_92%,35%_99%,24%_90%,13%_96%,5%_82%,9%_66%,1%_51%,7%_35%)]',
			'bg-[linear-gradient(135deg,rgba(255,255,255,0.48),rgba(255,255,255,0.16)_18%,transparent_42%,transparent_70%,rgba(15,23,42,0.045))]',
			'shadow-[inset_0_0_0_2px_rgba(148,163,184,0.18),inset_12px_16px_28px_rgba(255,255,255,0.30),inset_-12px_-14px_24px_rgba(15,23,42,0.045)]',
			'dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_22%,transparent_72%,rgba(15,23,42,0.42))]',
			'dark:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22),inset_0_0_42px_rgba(0,0,0,0.58)]',
		),
	);

	const approvalTierTearShadowStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute inset-0 -z-10',
			'[clip-path:polygon(2%_13%,10%_5%,18%_10%,28%_3%,41%_8%,52%_2%,63%_9%,76%_4%,88%_12%,97%_7%,94%_23%,99%_39%,95%_54%,98%_72%,90%_84%,82%_96%,70%_90%,58%_98%,45%_92%,35%_99%,24%_90%,13%_96%,5%_82%,9%_66%,1%_51%,7%_35%)]',
			'translate-y-2 scale-[1.012] bg-slate-400/[0.08] blur-xl',
			'dark:translate-y-0 dark:scale-100 dark:bg-black/35 dark:blur-xl',
		),
	);

	const approvalTierBadgeStyleClasses = twMerge(
		clsx(
			'relative z-30 mt-4 flex w-full max-w-none flex-col',
			'gap-2 rounded-2xl border border-white/14 bg-slate-950/48',
			'px-5 py-4 font-orbitron text-white shadow-2xl shadow-black/34',
			'backdrop-blur-[2px]',
			'laptop:absolute laptop:right-[7%] laptop:top-[10%] laptop:mt-0 laptop:w-auto laptop:max-w-[28rem] laptop:px-6',
		),
	);

	const approvalTierBadgeRowStyleClasses = twMerge(clsx('flex items-center gap-3'));

	const approvalTierBadgeValueStyleClasses = twMerge(
		clsx(
			'bg-gradient-to-b from-rose-200 via-flipeffect-flip to-rose-500',
			'bg-clip-text text-4xl font-black leading-none text-transparent',
			'drop-shadow-[0_0_14px_rgba(244,63,94,0.76)]',
			'tablet:text-5xl laptop:text-6xl',
		),
	);

	const economySourceTooltipStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute bottom-full left-1/2 z-50 mb-4',
			'w-max max-w-[22rem] -translate-x-1/2 whitespace-normal',
			'rounded-xl border border-white/25 bg-slate-950/95 px-5 py-3',
			'font-sans text-sm font-bold leading-snug text-white',
			'opacity-0 shadow-2xl backdrop-blur-md transition-opacity duration-200',
			'group-hover:opacity-100 tablet:text-base',
		),
	);

	const approvalTierBadgeLabelStyleClasses = twMerge(
		clsx(
			'rounded-lg border border-cyan-200/24 bg-cyan-300/12 px-3 py-2',
			'text-base font-black uppercase leading-none tracking-[0.2em]',
			'text-cyan-100 drop-shadow-[0_0_12px_rgba(103,232,249,0.6)]',
			'tablet:text-xl laptop:text-2xl',
		),
	);

	const approvalTierBadgeHeadlineStyleClasses = twMerge(
		clsx(
			'text-base font-black uppercase tracking-[0.12em] text-cyan-100',
			'drop-shadow-[0_0_12px_rgba(103,232,249,0.45)] tablet:text-xl',
		),
	);

	const approvalTierBadgeDescriptionStyleClasses = twMerge(
		clsx(
			'max-w-[26rem] text-sm font-extrabold leading-6 text-white/88',
			'drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] tablet:text-base tablet:leading-7',
		),
	);

	const approvalTimelineTriggerButtonStyleClasses = twMerge(
		clsx(
			'relative z-40 flex h-40 w-28 cursor-pointer overflow-hidden',
			'origin-top-right items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-300 hover:z-50 hover:scale-[1.55] hover:opacity-100',
			'active:scale-95 active:opacity-75',
			'tablet:h-56 tablet:w-38',
			'laptop:absolute laptop:right-8 laptop:top-4 laptop:h-72 laptop:w-48',
		),
	);

	const approvalTimelineTriggerImageStyleClasses = twMerge(
		clsx(
			'h-full w-full object-contain',
			'drop-shadow-[0_12px_24px_rgba(15,23,42,0.35)]',
			'dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]',
		),
	);

	const approvalQuizTriggerButtonStyleClasses = twMerge(
		clsx(
			'relative z-40 flex h-40 w-[6rem] cursor-pointer overflow-hidden',
			'origin-top-left items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-300 hover:z-50 hover:scale-[1.55] hover:opacity-100',
			'active:scale-95 active:opacity-75',
			'tablet:h-56 tablet:w-[8rem]',
			'laptop:absolute laptop:left-8 laptop:top-4 laptop:h-72 laptop:w-[10.5rem]',
		),
	);

	const approvalQuizTriggerImageStyleClasses = twMerge(
		clsx(
			'h-full w-full object-contain object-center',
			'drop-shadow-[0_12px_24px_rgba(15,23,42,0.35)]',
			'dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]',
		),
	);

	const approvalTimelineModalRootStyleClasses = twMerge(
		clsx(
			'w-auto overflow-hidden border-none! bg-transparent! shadow-none!',
			'dark:border-none! dark:bg-transparent! dark:shadow-none!',
		),
	);

	const approvalTimelineModalContentWrapperStyleClasses = twMerge(clsx('max-h-[90vh] bg-transparent! p-0!'));

	const approvalTimelineModalHeaderStyleClasses = twMerge(
		clsx(
			'absolute right-2 top-2 z-20 border-none! bg-transparent! p-0!',
			'dark:border-none!',
		),
	);

	const approvalTimelineModalCloseButtonStyleClasses = twMerge(
		clsx(
			'cursor-pointer border! border-white/35! bg-slate-950/72! text-white!',
			'h-8! w-8! tablet:h-10! tablet:w-10!',
			'shadow-lg shadow-black/35 backdrop-blur-md',
			'hover:border-flipeffect-rose-bright/80! hover:bg-slate-950/90!',
			'hover:text-flipeffect-rose-bright!',
			'[&_.p-button-icon]:text-white! hover:[&_.p-button-icon]:text-flipeffect-rose-bright!',
			'dark:border-white/25! dark:bg-black/62! dark:text-white!',
			'dark:hover:bg-black/82! dark:hover:text-flipeffect-rose-bright!',
		),
	);

	const approvalTimelineModalCloseIconStyleClasses = twMerge(clsx('text-xs! text-white! tablet:text-sm! dark:text-white!'));

	const approvalQuizModalRootStyleClasses = twMerge(
		clsx(
			'w-auto overflow-hidden border-none! bg-slate-950! shadow-2xl',
			'shadow-flipeffect-cyan/20',
			'dark:border-none! dark:bg-black! dark:shadow-black/45',
		),
	);

	const approvalTierActiveImageStyleClasses = twMerge(clsx('opacity-100 scale-100 blur-0 saturate-100'));

	const approvalTierInactiveImageStyleClasses = twMerge(clsx('opacity-0 scale-[1.02] blur-[2px] saturate-75'));

	const getApprovalTierImageStyleClasses = (index: number) => {
		return twMerge(
			clsx(
				approvalTierImageStyleClasses,
				index === activeApprovalRatingTierIndex.value
					? approvalTierActiveImageStyleClasses
					: approvalTierInactiveImageStyleClasses,
			),
		);
	};

	// --- Tier images advance on timers that match the animated economy approval value. ---
	const startApprovalRatingTierAnimation = () => {
		approvalRatingTierMaps
			.slice(0, targetApprovalRatingTierIndex.value + 1)
			.forEach((_tierMap, index) => {
				if (index === 0) {
					return;
				}

				const delayMs =
					index * APPROVAL_RATING_TIER_STEP_DELAY_MS +
					(index === targetApprovalRatingTierIndex.value
						? APPROVAL_RATING_TIER_FINAL_SETTLE_DELAY_MS
						: 0);
				const timeoutId = window.setTimeout(() => {
					activeApprovalRatingTierIndex.value = index;
				}, delayMs);

				approvalRatingTierTimeoutIds.push(timeoutId);
			});
	};

	const stopApprovalRatingTierAnimation = () => {
		approvalRatingTierTimeoutIds.forEach((timeoutId) => {
			window.clearTimeout(timeoutId);
		});
		approvalRatingTierTimeoutIds.length = 0;
	};

	const startApprovalRatingAnimation = () => { startApprovalRatingTierAnimation(); startApprovalRatingPercentageAnimation(); };

	const stopApprovalRatingAnimation = () => { stopApprovalRatingTierAnimation(); stopApprovalRatingPercentageAnimation(); };

	return {
		approvalRatingTierMaps,
		animatedApprovalRatingPercentage,
		economyApprovalSourceCaption,
		activeApprovalRatingTierMap,
		approvalTierCompositionStyleClasses,
		approvalTierSectionStyleClasses,
		approvalTierViewportStyleClasses,
		approvalTierEdgeStyleClasses,
		approvalTierTearShadowStyleClasses,
		approvalTierBadgeStyleClasses,
		approvalTierBadgeRowStyleClasses,
		approvalTierBadgeValueStyleClasses,
		economySourceTooltipStyleClasses,
		approvalTierBadgeLabelStyleClasses,
		approvalTierBadgeHeadlineStyleClasses,
		approvalTierBadgeDescriptionStyleClasses,
		approvalTimelineTriggerButtonStyleClasses,
		approvalTimelineTriggerImageStyleClasses,
		approvalQuizTriggerButtonStyleClasses,
		approvalQuizTriggerImageStyleClasses,
		approvalTimelineModalRootStyleClasses,
		approvalTimelineModalContentWrapperStyleClasses,
		approvalTimelineModalHeaderStyleClasses,
		approvalTimelineModalCloseButtonStyleClasses,
		approvalTimelineModalCloseIconStyleClasses,
		approvalQuizModalRootStyleClasses,
		getApprovalTierImageStyleClasses,
		startApprovalRatingAnimation,
		stopApprovalRatingAnimation,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
