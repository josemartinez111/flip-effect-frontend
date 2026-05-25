// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > PAGES_COMPOSABLES
// > USE_APPROVAL_RATING_TIER_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { computed, ref } from 'vue';
import {
	UsaApprovalMapTier1,
	UsaApprovalMapTier2,
	UsaApprovalMapTier3,
	UsaApprovalMapTier4,
	UsaApprovalMapTier5,
} from '../../../assets';
import { UseAnimatedPercentageComposable } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type ApprovalRatingTierMap = {
	minApprovalRating: number;
	image: string;
	alt: string;
	badgeHeadline: string;
	badgeDescription: string;
};

// ---
// TODO: Replace this static value with an approval-rating API action.
// The action should fetch one normalized percentage, cache it if needed,
// then feed this same source into both the tier map and Trump avatar card.
// When wired, rename the shared value to lower camelCase, likely
// `currentTrumpApprovalRatingPercentage`, because it will no longer be a
// compile-time constant.
// ---
export const CURRENT_TRUMP_APPROVAL_RATING_PERCENTAGE = 31;

export const UseApprovalRatingTierComposable = () => {
	const APPROVAL_RATING_TIER_STEP_DELAY_MS = 2400;
	const APPROVAL_RATING_TIER_FINAL_SETTLE_DELAY_MS = 200;

	const trumpApprovalRatingPercentage = ref(
		CURRENT_TRUMP_APPROVAL_RATING_PERCENTAGE,
	);
	const activeApprovalRatingTierIndex = ref(0);
	const approvalRatingTierTimeoutIds: number[] = [];

	const {
		animatedPercentage: animatedApprovalRatingPercentage,
		startAnimatedPercentage: startApprovalRatingPercentageAnimation,
		stopAnimatedPercentage: stopApprovalRatingPercentageAnimation,
	} = UseAnimatedPercentageComposable({
		initialPercentage: 100,
		targetPercentage: trumpApprovalRatingPercentage,
		getPercentageAnimationSteps: (targetPercentage) => {
			return [
				{
					fromPercentage: 100,
					toPercentage: 90,
					delayMs: 300,
					durationMs: 1900,
					easing: 'easeInOutSine',
				},
				{
					fromPercentage: 90,
					toPercentage: 95,
					delayMs: 1500,
					durationMs: 1100,
					easing: 'easeOutCubic',
				},
				{
					fromPercentage: 95,
					toPercentage: 85,
					delayMs: 2120,
					durationMs: 1600,
					easing: 'easeInOutSine',
				},
				{
					fromPercentage: 85,
					toPercentage: targetPercentage,
					delayMs: 3600,
					durationMs: 3800,
					easing: 'easeInQuart',
				},
			];
		},
	});

	const approvalRatingTierMaps: Array<ApprovalRatingTierMap> = [
		{
			minApprovalRating: 45,
			image: UsaApprovalMapTier1,
			alt: 'Approval tier one map',
			badgeHeadline: 'Room to survive',
			badgeDescription:
				'Approval is still high enough to protect weak allies.',
		},
		{
			minApprovalRating: 40,
			image: UsaApprovalMapTier2,
			alt: 'Approval tier two map',
			badgeHeadline: 'Coalition cracking',
			badgeDescription:
				'Soft supporters start becoming election liabilities.',
		},
		{
			minApprovalRating: 35,
			image: UsaApprovalMapTier3,
			alt: 'Approval tier three map',
			badgeHeadline: 'Backlash spreads',
			badgeDescription: 'The brand starts dragging down close races.',
		},
		{
			minApprovalRating: 28,
			image: UsaApprovalMapTier4,
			alt: 'Approval tier four map',
			badgeHeadline: 'Majority at risk',
			badgeDescription: 'Defending the agenda gets harder for every ally.',
		},
		{
			minApprovalRating: 0,
			image: UsaApprovalMapTier5,
			alt: 'Approval tier five map',
			badgeHeadline: 'Political freefall',
			badgeDescription:
				'The fight shifts from winning to limiting damage.',
		},
	];

	const targetApprovalRatingTierIndex = computed(() => {
		const tierIndex = approvalRatingTierMaps.findIndex((tierMap) => {
			return (
				trumpApprovalRatingPercentage.value >= tierMap.minApprovalRating
			);
		});
		return tierIndex === -1
			? approvalRatingTierMaps.length - 1
			: tierIndex;
	});

	const activeApprovalRatingTierMap = computed(
		() => approvalRatingTierMaps[activeApprovalRatingTierIndex.value],
	);

	const approvalTierCompositionStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto -mt-44 w-[min(98vw,100rem)]',
			'overflow-visible bg-transparent px-4 pb-4 pt-10',
			'tablet:-mt-52 tablet:px-6 tablet:pb-6 tablet:pt-14 laptop:-mt-60',
		),
	);

	const approvalTierSectionStyleClasses = twMerge(
		clsx(
			'relative scale-[0.70] origin-top overflow-visible',
			'dark:overflow-hidden',
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
			'absolute right-[9%] top-[12%] z-30 flex max-w-[16rem] flex-col',
			'gap-1 rounded-xl border-none bg-slate-950/62 px-3 py-2',
			'font-orbitron text-white shadow-lg shadow-black/30 backdrop-blur-md',
		),
	);

	const approvalTierBadgeRowStyleClasses = twMerge(
		clsx('flex items-baseline gap-1.5'),
	);

	const approvalTierBadgeValueStyleClasses = twMerge(
		clsx(
			'bg-gradient-to-b from-rose-200 via-flipeffect-flip to-rose-500',
			'bg-clip-text text-xl font-black leading-none text-transparent',
			'drop-shadow-[0_0_10px_rgba(244,63,94,0.72)] tablet:text-2xl',
		),
	);

	const approvalTierBadgeLabelStyleClasses = twMerge(
		clsx(
			'text-[0.58rem] font-bold uppercase text-white/72',
			'tablet:text-[0.64rem]',
		),
	);

	const approvalTierBadgeHeadlineStyleClasses = twMerge(
		clsx(
			'text-[0.66rem] font-black uppercase tracking-[0.1em] text-cyan-100',
		),
	);

	const approvalTierBadgeDescriptionStyleClasses = twMerge(
		clsx(
			'text-[0.58rem] font-bold leading-snug text-white/70 tablet:text-[0.64rem]',
		),
	);

	const approvalTimelineTriggerButtonStyleClasses = twMerge(
		clsx(
			'absolute right-4 top-4 z-40 flex h-40 w-28 cursor-pointer overflow-hidden',
			'origin-top-right items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-300 hover:z-50 hover:scale-[1.55] hover:opacity-100',
			'active:scale-95 active:opacity-75',
			'tablet:right-8 tablet:h-56 tablet:w-38 laptop:h-72 laptop:w-48',
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
			'absolute left-4 top-4 z-40 flex h-40 w-[6rem] cursor-pointer overflow-hidden',
			'origin-top-left items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-300 hover:z-50 hover:scale-[1.55] hover:opacity-100',
			'active:scale-95 active:opacity-75',
			'tablet:left-8 tablet:h-56 tablet:w-[8rem] laptop:h-72 laptop:w-[10.5rem]',
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

	const approvalTimelineModalContentWrapperStyleClasses = twMerge(
		clsx('max-h-[90vh] bg-transparent! p-0!'),
	);

	const approvalTimelineModalHeaderStyleClasses = twMerge(
		clsx(
			'absolute right-2 top-2 z-20 border-none! bg-transparent! p-0!',
			'dark:border-none!',
		),
	);

	const approvalTimelineModalCloseButtonStyleClasses = twMerge(
		clsx(
			'cursor-pointer border! border-white/35! bg-slate-950/72! text-white!',
			'shadow-lg shadow-black/35 backdrop-blur-md',
			'hover:border-flipeffect-rose-bright/80! hover:bg-slate-950/90!',
			'hover:text-flipeffect-rose-bright!',
			'[&_.p-button-icon]:text-white! hover:[&_.p-button-icon]:text-flipeffect-rose-bright!',
			'dark:border-white/25! dark:bg-black/62! dark:text-white!',
			'dark:hover:bg-black/82! dark:hover:text-flipeffect-rose-bright!',
		),
	);

	const approvalTimelineModalCloseIconStyleClasses = twMerge(
		clsx('text-white! dark:text-white!'),
	);

	const approvalTimelineModalCardStyleClasses = twMerge(
		clsx('relative overflow-hidden bg-transparent! shadow-none!'),
	);

	const approvalTimelineModalCardBodyStyleClasses = twMerge(clsx('p-0!'));

	const approvalTimelineModalCardContentStyleClasses = twMerge(
		clsx('relative p-0!'),
	);

	const approvalTimelineModalImageStyleClasses = twMerge(
		clsx(
			'relative z-10 max-h-[86vh] w-[min(92vw,62rem)] object-contain',
			'drop-shadow-[0_24px_48px_rgba(15,23,42,0.25)]',
			'dark:drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]',
		),
	);

	const approvalTimelineStepperStyleClasses = twMerge(
		clsx(
			'absolute bottom-6 left-1/2 z-40 -translate-x-1/2',
			'scale-[0.72] rounded-full',
			'drop-shadow-[0_18px_34px_rgba(0,0,0,0.55)]',
			'tablet:bottom-8 tablet:scale-[0.82]',
		),
	);

	const approvalQuizModalRootStyleClasses = twMerge(
		clsx(
			'w-auto overflow-hidden border-none! bg-slate-950! shadow-2xl',
			'shadow-flipeffect-cyan/20',
			'dark:border-none! dark:bg-black! dark:shadow-black/45',
		),
	);

	const approvalTierActiveImageStyleClasses = twMerge(
		clsx('opacity-100 scale-100 blur-0 saturate-100'),
	);

	const approvalTierInactiveImageStyleClasses = twMerge(
		clsx('opacity-0 scale-[1.02] blur-[2px] saturate-75'),
	);

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

	const startApprovalRatingAnimation = () => {
		startApprovalRatingTierAnimation();
		startApprovalRatingPercentageAnimation();
	};

	const stopApprovalRatingAnimation = () => {
		stopApprovalRatingTierAnimation();
		stopApprovalRatingPercentageAnimation();
	};

	return {
		approvalRatingTierMaps,
		animatedApprovalRatingPercentage,
		activeApprovalRatingTierMap,
		approvalTierCompositionStyleClasses,
		approvalTierSectionStyleClasses,
		approvalTierViewportStyleClasses,
		approvalTierEdgeStyleClasses,
		approvalTierTearShadowStyleClasses,
		approvalTierBadgeStyleClasses,
		approvalTierBadgeRowStyleClasses,
		approvalTierBadgeValueStyleClasses,
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
		approvalTimelineModalCardStyleClasses,
		approvalTimelineModalCardBodyStyleClasses,
		approvalTimelineModalCardContentStyleClasses,
		approvalTimelineModalImageStyleClasses,
		approvalTimelineStepperStyleClasses,
		approvalQuizModalRootStyleClasses,
		getApprovalTierImageStyleClasses,
		startApprovalRatingAnimation,
		stopApprovalRatingAnimation,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
