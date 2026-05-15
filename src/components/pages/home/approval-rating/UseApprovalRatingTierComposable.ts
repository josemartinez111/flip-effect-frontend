// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//             USE_APPROVAL_RATING_TIER_COMPOSABLE.TS
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
} from '../../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type ApprovalRatingTierMap = {
	minApprovalRating: number;
	image: string;
	alt: string;
};

export const UseApprovalRatingTierComposable = () => {
	const TRUMP_APPROVAL_RATING = 36;
	const activeApprovalRatingTierIndex = ref(0);
	const approvalRatingTierTimeoutIds: number[] = [];

	const approvalRatingTierMaps: Array<ApprovalRatingTierMap> = [
		{
			minApprovalRating: 45,
			image: UsaApprovalMapTier1,
			alt: 'Approval tier one map',
		},
		{
			minApprovalRating: 40,
			image: UsaApprovalMapTier2,
			alt: 'Approval tier two map',
		},
		{
			minApprovalRating: 35,
			image: UsaApprovalMapTier3,
			alt: 'Approval tier three map',
		},
		{
			minApprovalRating: 28,
			image: UsaApprovalMapTier4,
			alt: 'Approval tier four map',
		},
		{
			minApprovalRating: 0,
			image: UsaApprovalMapTier5,
			alt: 'Approval tier five map',
		},
	];

	const targetApprovalRatingTierIndex = computed(() => {
		const tierIndex = approvalRatingTierMaps.findIndex((tierMap) => {
			return TRUMP_APPROVAL_RATING >= tierMap.minApprovalRating;
		});

		return tierIndex === -1 ? approvalRatingTierMaps.length - 1 : tierIndex;
	});

	const approvalRatingTierAnimationSequence = computed(() => {
		return approvalRatingTierMaps.slice(
			0,
			targetApprovalRatingTierIndex.value + 1,
		);
	});
	
	const approvalTierSectionStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto -mt-44 w-[min(98vw,100rem)] scale-[0.76]',
			'origin-top overflow-hidden bg-transparent px-4 pb-4 pt-10',
			'tablet:-mt-52 tablet:px-6 tablet:pb-6 tablet:pt-14 laptop:-mt-60',
		),
	);

	const approvalTierViewportStyleClasses = twMerge(
		clsx(
			'relative aspect-[3/2] w-full overflow-hidden',
			' backdrop-blur-[2px]',
			'shadow-[0_0_28px_rgba(14,165,233,0.24),inset_0_0_34px_rgba(2,6,23,0.62)]',
			'[clip-path:polygon(2%_13%,10%_5%,18%_10%,28%_3%,41%_8%,52%_2%,63%_9%,76%_4%,88%_12%,97%_7%,94%_23%,99%_39%,95%_54%,98%_72%,90%_84%,82%_96%,70%_90%,58%_98%,45%_92%,35%_99%,24%_90%,13%_96%,5%_82%,9%_66%,1%_51%,7%_35%)]',
		),
	);
	
	const approvalTierImageStyleClasses = twMerge(
		clsx(
			'absolute inset-0 w-full h-full object-cover object-center',
			'transition-[opacity,transform,filter] duration-[1400ms] ease-out',
			'tablet:p-8 laptop:p-10',
		),
	);

	const approvalTierEdgeStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute inset-0 z-20',
			'[clip-path:polygon(2%_13%,10%_5%,18%_10%,28%_3%,41%_8%,52%_2%,63%_9%,76%_4%,88%_12%,97%_7%,94%_23%,99%_39%,95%_54%,98%_72%,90%_84%,82%_96%,70%_90%,58%_98%,45%_92%,35%_99%,24%_90%,13%_96%,5%_82%,9%_66%,1%_51%,7%_35%)]',
			'bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_22%,transparent_72%,rgba(15,23,42,0.42))]',
			'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.22),inset_0_0_42px_rgba(0,0,0,0.58)]',
		),
	);
	
	const approvalTierTearShadowStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute inset-0 -z-10',
			'[clip-path:polygon(2%_13%,10%_5%,18%_10%,28%_3%,41%_8%,52%_2%,63%_9%,76%_4%,88%_12%,97%_7%,94%_23%,99%_39%,95%_54%,98%_72%,90%_84%,82%_96%,70%_90%,58%_98%,45%_92%,35%_99%,24%_90%,13%_96%,5%_82%,9%_66%,1%_51%,7%_35%)]',
			'bg-slate-300/40 dark:bg-black/35 blur-xl',
		),
	);

	const approvalTierBadgeStyleClasses = twMerge(
		clsx(
			'absolute right-[9%] top-[12%] z-30 flex items-baseline gap-1.5',
			'rounded-full border-none bg-slate-950/55 px-3 py-1.5',
			'font-orbitron text-white shadow-lg shadow-black/30 backdrop-blur-md',
		),
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
		approvalRatingTierAnimationSequence.value.forEach((_tierMap, index) => {
			if (index === 0) {
				return;
			}

			const delayMs =
				index === targetApprovalRatingTierIndex.value ? 4600 : index * 1600;
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
	};

	return {
		approvalRatingTierMaps,
		TRUMP_APPROVAL_RATING,
		approvalTierSectionStyleClasses,
		approvalTierViewportStyleClasses,
		approvalTierEdgeStyleClasses,
		approvalTierTearShadowStyleClasses,
		approvalTierBadgeStyleClasses,
		approvalTierBadgeValueStyleClasses,
		approvalTierBadgeLabelStyleClasses,
		getApprovalTierImageStyleClasses,
		startApprovalRatingTierAnimation,
		stopApprovalRatingTierAnimation,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
