// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > PAGES_COMPOSABLES
// > USE_HERO_APPROVAL_RATING_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseHeroApprovalRatingComposable = () => {
	const cardContainerStyleClasses = twMerge(
		clsx(
			'relative mx-auto mt-3 h-[28rem] w-full',
			'rounded-[1.6rem] border-none bg-white/20',
			'backdrop-blur-sm',
			'tablet:mt-6 tablet:h-[34rem]',
			'laptop:mt-20 laptop:h-[40rem] laptop:w-[min(98vw,100rem)] laptop:origin-top laptop:scale-[0.76]',
			'dark:bg-slate-950/25',
		),
	);

	const cardBgImageStyleClasses = twMerge(
		clsx(
			'absolute inset-0 h-full w-full object-fill',
			'saturate-[0.96] contrast-[1.02] brightness-[1.08]',
			'dark:brightness-[1.14] dark:saturate-[0.9] dark:contrast-[0.95]',
		),
	);

	const cardBodyStyleClasses = twMerge(clsx('relative z-10 h-full p-0'));

	const cardContentStyleClasses = twMerge(clsx('relative h-full p-0'));

	const cardSlotLayerStyleClasses = twMerge(clsx('relative z-10 h-full'));

	const cardHeaderStyleClasses = twMerge(
		clsx(
			'absolute inset-x-0 top-2 z-30 text-center',
			'bg-gradient-to-r from-flipeffect-sky via-flipeffect-cyan to-flipeffect-effect',
			'bg-clip-text font-orbitron text-xl font-black tracking-normal text-transparent',
			'drop-shadow-[0_3px_8px_rgba(14,165,233,0.7)]',
			'tablet:text-3xl laptop:text-4xl',
		),
	);

	const cardExplanationStyleClasses = twMerge(
		clsx(
			'absolute bottom-16 left-[16%] z-30 text-left',
			'text-sm font-bold leading-6 text-slate-200/88',
			'drop-shadow-[0_2px_6px_rgba(15,23,42,0.58)]',
			'tablet:bottom-20 tablet:text-base laptop:text-lg',
			'dark:text-slate-300/70 dark:drop-shadow-[0_2px_7px_rgba(0,0,0,0.7)]',
		),
	);

	const presidentNameStyleClasses = twMerge(
		clsx(
			'absolute top-[18%] z-30 -translate-x-1/2 text-center',
			'bg-gradient-to-r from-flipeffect-presidential-white via-flipeffect-presidential-silver to-flipeffect-presidential-charcoal',
			'bg-clip-text font-orbitron text-base font-black text-transparent',
			'drop-shadow-[0_3px_8px_rgba(15,23,42,0.5)]',
			'tablet:text-2xl laptop:text-3xl',
		),
	);

	const nixonNameStyleClasses = twMerge(
		clsx(presidentNameStyleClasses, 'left-[calc(21%+min(10vw,11.5rem))]'),
	);

	const trumpNameStyleClasses = twMerge(
		clsx(
			presidentNameStyleClasses,
			'right-[calc(21%+min(10vw,11.5rem))] translate-x-1/2',
		),
	);

	const nixonPercentageStyleClasses = twMerge(
		clsx(
			'absolute left-[calc(22%+min(10vw,11.5rem))] top-[57%] z-30 -translate-x-1/2',
			'bg-gradient-to-b from-flipeffect-nixon-gold via-flipeffect-nixon-amber to-flipeffect-nixon-bronze',
			'bg-clip-text font-[Impact] text-4xl leading-none text-transparent',
			'drop-shadow-[0_5px_12px_rgba(245,158,11,0.55)]',
			'tablet:text-5xl laptop:text-6xl',
		),
	);

	const trumpPercentageStyleClasses = twMerge(
		clsx(
			'absolute right-[calc(22%+min(10vw,11.5rem))] top-[57%] z-30 translate-x-1/2',
			'bg-gradient-to-b from-flipeffect-rose-bright via-flipeffect-flip to-flipeffect-rose',
			'bg-clip-text font-[Impact] text-4xl leading-none text-transparent',
			'drop-shadow-[0_5px_12px_rgba(225,29,72,0.58)]',
			'tablet:text-5xl laptop:text-6xl laptop:right-[calc(19%+min(10vw,11.5rem))]',
		),
	);

	const avatarImageStyleClasses = twMerge(
		clsx(
			'absolute top-[39%] z-20 w-[min(30vw,17rem)] -translate-y-1/2',
			'object-contain tablet:w-[min(24vw,20rem)] laptop:w-[min(20vw,23rem)]',
		),
	);

	const nixonAvatarStyleClasses = twMerge(
		clsx(avatarImageStyleClasses, 'left-[21%]'),
	);

	const trumpAvatarStyleClasses = twMerge(
		clsx(avatarImageStyleClasses, 'right-[21%]'),
	);

	const trumpSourceTooltipStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute left-full top-full z-50 mt-4',
			'w-max max-w-[22rem] -translate-x-1/4 whitespace-normal',
			'rounded-xl border border-white/25 bg-slate-950/95 px-5 py-3',
			'font-sans text-sm font-bold leading-snug text-white',
			'opacity-0 shadow-2xl backdrop-blur-md transition-opacity duration-200',
			'group-hover:opacity-100',
		),
	);

	return {
		cardContainerStyleClasses,
		cardBgImageStyleClasses,
		cardBodyStyleClasses,
		cardContentStyleClasses,
		cardSlotLayerStyleClasses,
		cardHeaderStyleClasses,
		cardExplanationStyleClasses,
		nixonNameStyleClasses,
		trumpNameStyleClasses,
		nixonPercentageStyleClasses,
		trumpPercentageStyleClasses,
		nixonAvatarStyleClasses,
		trumpAvatarStyleClasses,
		trumpSourceTooltipStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
