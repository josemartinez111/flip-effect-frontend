// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_MIDTERMS_COUNTDOWN_COMPOSABLE.TS 
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseMidtermsCountdownComposable = () => {
	const countdownCardStyleClasses = twMerge(
		clsx(
			'absolute left-4 top-4 z-30 h-40 w-28 overflow-hidden rounded-xl',
			'border border-white/18 bg-slate-950/42 text-white shadow-2xl',
			'shadow-slate-950/25 backdrop-blur-md',
			'tablet:left-8 tablet:h-56 tablet:w-38 laptop:h-72 laptop:w-48',
			'dark:border-white/12 dark:bg-slate-950/38 dark:shadow-black/45',
		),
	);

	const countdownCardBodyStyleClasses = twMerge(clsx('h-full p-0'));

	const countdownCardContentStyleClasses = twMerge(
		clsx(
			'flex h-full flex-col items-center justify-center px-2 py-3',
			'font-orbitron text-center tablet:px-3 tablet:py-4',
		),
	);

	const countdownEyebrowStyleClasses = twMerge(
		clsx(
			'text-[0.55rem] font-black uppercase tracking-[0.16em]',
			'text-cyan-100 drop-shadow-[0_0_8px_rgba(125,211,252,0.7)]',
			'tablet:text-[0.68rem] laptop:text-xs',
		),
	);

	const countdownDaysValueStyleClasses = twMerge(
		clsx(
			'mt-2 bg-gradient-to-b from-white via-cyan-100 to-sky-300',
			'bg-clip-text text-4xl font-black leading-none text-transparent',
			'drop-shadow-[0_0_16px_rgba(56,189,248,0.9)]',
			'tablet:mt-4 tablet:text-6xl laptop:text-7xl',
		),
	);

	const countdownDaysLabelStyleClasses = twMerge(
		clsx(
			'mt-1 text-[0.6rem] font-black uppercase tracking-[0.22em]',
			'text-white/82 tablet:text-xs',
		),
	);

	const countdownTimeGridStyleClasses = twMerge(
		clsx(
			'mt-3 grid w-full grid-cols-3 gap-1 border-y border-white/16 py-2',
			'tablet:mt-5 tablet:gap-2 tablet:py-3',
		),
	);

	const countdownTimeValueStyleClasses = twMerge(
		clsx(
			'block text-sm font-black leading-none text-white',
			'drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]',
			'tablet:text-xl laptop:text-2xl',
		),
	);

	const countdownTimeLabelStyleClasses = twMerge(
		clsx(
			'mt-1 block text-[0.45rem] font-bold uppercase tracking-[0.12em]',
			'text-cyan-100/78 tablet:text-[0.55rem]',
		),
	);

	const countdownDateLabelStyleClasses = twMerge(
		clsx(
			'mt-2 max-w-full text-[0.48rem] font-bold leading-tight text-white/66',
			'tablet:mt-4 tablet:text-[0.62rem] laptop:text-[0.68rem]',
		),
	);

	return {
		countdownCardStyleClasses,
		countdownCardBodyStyleClasses,
		countdownCardContentStyleClasses,
		countdownEyebrowStyleClasses,
		countdownDaysValueStyleClasses,
		countdownDaysLabelStyleClasses,
		countdownTimeGridStyleClasses,
		countdownTimeValueStyleClasses,
		countdownTimeLabelStyleClasses,
		countdownDateLabelStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
