// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                    HOME-COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const useHomeComposable = () => {
	const mainContainerStyleClasses = twMerge(
		clsx(
			'relative min-h-screen w-full overflow-hidden',
			'bg-transparent text-slate-950',
			'dark:text-white',
		),
	);

	const heroSectionStyleClasses = twMerge(
		clsx(
			'relative isolate flex min-h-[calc(100vh-4rem)] items-center',
			'px-5 pb-20 pt-16 tablet:px-8 laptop:pb-24 laptop:pt-20',
		),
	);

	const heroContentContainerStyleClasses = twMerge(
		clsx(
			'relative z-10 mx-auto grid w-full max-w-7xl items-center',
			'gap-10 laptop:grid-cols-[minmax(0,0.84fr)_minmax(34rem,1.16fr)]',
		),
	);

	const heroCopyContainerStyleClasses = twMerge(
		clsx('max-w-2xl text-left'),
	);

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

	return {
		mainContainerStyleClasses,
		heroSectionStyleClasses,
		heroContentContainerStyleClasses,
		heroCopyContainerStyleClasses,
		homeTitleStyleClasses,
		heroLeadStyleClasses,
		heroCardShellStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
