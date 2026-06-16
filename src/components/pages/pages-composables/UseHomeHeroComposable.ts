// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_HOME_HERO_COMPOSABLE.TS 
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseHomeHeroComposable = () => {
	const heroSectionStyleClasses = twMerge(
		clsx(
			'relative isolate flex min-h-[calc(100vh-4rem)] items-center',
			'px-5 pb-20 pt-60 tablet:px-8 tablet:pt-56 laptop:pb-24 laptop:pt-52',
		),
	);

	const heroContentContainerStyleClasses = twMerge(
		clsx(
			'relative z-10 mx-auto grid w-full max-w-7xl items-center',
			'gap-10 laptop:grid-cols-[minmax(0,0.84fr)_minmax(34rem,1.16fr)]',
		),
	);

	const heroCopyContainerStyleClasses = twMerge(clsx('max-w-2xl text-left'));

	const homeTitleStyleClasses = twMerge(
		clsx(
			'font-orbitron text-4xl font-extrabold leading-[1.05] tracking-normal',
			'text-slate-950 tablet:text-5xl laptop:text-6xl',
			'dark:text-white',
		),
	);

	const heroLeadStyleClasses = twMerge(
		clsx(
			'mt-6 max-w-xl text-base font-medium leading-8',
			'text-slate-700 tablet:text-lg dark:text-slate-200/82',
		),
	);

	const heroCardShellStyleClasses = twMerge(
		clsx('relative col-span-full flex w-full justify-center'),
	);

	const branchesTriggerButtonStyleClasses = twMerge(
		clsx(
			'absolute right-4 top-4 z-30 flex h-40 w-28 cursor-pointer overflow-hidden',
			'origin-top-right items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-300 hover:z-50 hover:scale-[1.55] hover:opacity-100',
			'active:scale-95 active:opacity-75',
			'tablet:right-8 tablet:h-56 tablet:w-38 laptop:h-72 laptop:w-48',
		),
	);

	const branchesTriggerImageStyleClasses = twMerge(
		clsx(
			'h-full w-full object-contain',
			'drop-shadow-[0_12px_24px_rgba(15,23,42,0.35)]',
			'dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]',
		),
	);

	const branchesModalCardStyleClasses = twMerge(
		clsx('relative overflow-hidden bg-transparent! shadow-none!'),
	);

	const branchesModalRootStyleClasses = twMerge(
		clsx(
			'w-auto overflow-hidden border-none! bg-transparent! shadow-none!',
			'dark:border-none! dark:bg-transparent! dark:shadow-none!',
		),
	);

	const branchesModalContentWrapperStyleClasses = twMerge(
		clsx('max-h-[90vh] bg-transparent! p-0!'),
	);

	const branchesModalHeaderStyleClasses = twMerge(
		clsx(
			'absolute right-2 top-2 z-20 border-none! bg-transparent! p-0!',
			'dark:border-none!',
		),
	);

	const branchesModalCloseButtonStyleClasses = twMerge(
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

	const branchesModalCloseIconStyleClasses = twMerge(
		clsx('text-white! dark:text-white!'),
	);

	const branchesModalCardBodyStyleClasses = twMerge(clsx('p-0!'));
	const branchesModalCardContentStyleClasses = twMerge(clsx('relative p-0!'));

	const branchesModalBgImageStyleClasses = twMerge(
		clsx(
			'absolute inset-0 h-full w-full object-cover',
			'opacity-35 saturate-[0.85] contrast-[0.9] brightness-[1.1]',
			'dark:opacity-28 dark:brightness-[1.3] dark:contrast-[0.85]',
		),
	);

	const branchesModalImageStyleClasses = twMerge(
		clsx(
			'relative z-10 max-h-[86vh] w-[min(92vw,62rem)] object-contain',
			'drop-shadow-[0_24px_48px_rgba(15,23,42,0.25)]',
			'dark:drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]',
		),
	);

	return {
		heroSectionStyleClasses,
		heroContentContainerStyleClasses,
		heroCopyContainerStyleClasses,
		homeTitleStyleClasses,
		heroLeadStyleClasses,
		heroCardShellStyleClasses,
		branchesTriggerButtonStyleClasses,
		branchesTriggerImageStyleClasses,
		branchesModalRootStyleClasses,
		branchesModalContentWrapperStyleClasses,
		branchesModalHeaderStyleClasses,
		branchesModalCloseButtonStyleClasses,
		branchesModalCloseIconStyleClasses,
		branchesModalCardStyleClasses,
		branchesModalCardBodyStyleClasses,
		branchesModalCardContentStyleClasses,
		branchesModalBgImageStyleClasses,
		branchesModalImageStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
