// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES 
// > USE_CIVIC_REPRESENTATIVE_SEARCH_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseCivicRepresentativeSearchComposable = () => {
	const civicSearchSectionStyleClasses = twMerge(
		clsx(
			'absolute left-1/2 top-20 z-40 w-[92vw] max-w-5xl -translate-x-1/2',
			'px-3 pb-6 tablet:top-18 laptop:top-16',
		),
	);

	const civicSearchShellStyleClasses = twMerge(
		clsx(
			'mx-auto flex flex-1 min-w-0 flex-col gap-3 rounded-2xl border px-4 py-3',
			'border-white/80 bg-white/62 shadow-[0_18px_46px_rgba(15,23,42,0.16)]',
			'backdrop-blur-xl',
			'dark:border-white/10 dark:bg-slate-950/42 dark:shadow-black/40',
		),
	);

	const civicSearchTitleStyleClasses = twMerge(
		clsx(
			'text-center font-orbitron text-base font-black uppercase',
			'tracking-[0.24em] text-cyan-700 tablet:text-lg',
			'drop-shadow-[0_0_16px_rgba(14,165,233,0.36)]',
			'dark:text-cyan-100 dark:drop-shadow-[0_0_18px_rgba(125,211,252,0.72)]',
		),
	);

	const civicSearchControlsStyleClasses = twMerge(
		clsx(
			'grid gap-3 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-center',
		),
	);

	const civicSearchInputStyleClasses = twMerge(
		clsx(
			'h-11 w-full rounded-xl border px-4 font-medium text-slate-950',
			'border-slate-200/85 bg-white/82 shadow-[inset_0_1px_3px_rgba(15,23,42,0.14),0_10px_22px_rgba(15,23,42,0.08)]',
			'placeholder:text-slate-500 focus:shadow-[inset_0_1px_3px_rgba(15,23,42,0.12),0_0_0_3px_rgba(14,165,233,0.16)]',
			'focus:outline-none',
			'dark:border-white/10 dark:bg-slate-950/58 dark:text-white',
			'dark:placeholder:text-slate-300/70 dark:focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.35),0_0_0_3px_rgba(103,232,249,0.16)]',
		),
	);

	const civicSearchFiltersStyleClasses = twMerge(
		clsx(
			'flex flex-wrap items-center justify-center gap-x-4 gap-y-2',
			'tablet:justify-end',
		),
	);

	const civicSearchFilterItemStyleClasses = twMerge(
		clsx(
			'flex items-center gap-2 rounded-lg px-2 py-1',
			'bg-white/44 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.22)]',
			'dark:bg-white/6 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
		),
	);

	const civicSearchFilterLabelStyleClasses = twMerge(
		clsx(
			'cursor-pointer select-none text-xs font-bold uppercase tracking-[0.08em]',
			'text-slate-700 dark:text-slate-200/82',
		),
	);

	const civicSearchApiNoteStyleClasses = twMerge(
		clsx(
			'rounded-xl border px-3 py-2 text-xs font-bold leading-5',
			'border-cyan-700/18 bg-cyan-50/62 text-slate-700',
			'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
			'dark:border-cyan-200/12 dark:bg-slate-950/46 dark:text-slate-200/82',
		),
	);

	const civicSearchApiNoteLabelStyleClasses = twMerge(
		clsx(
			'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.14em]',
			'text-cyan-700 dark:text-cyan-100',
		),
	);

	const civicSearchApiNoteLinkStyleClasses = twMerge(
		clsx(
			'cursor-pointer font-black text-cyan-700 underline underline-offset-4',
			'hover:text-slate-950 dark:text-cyan-100 dark:hover:text-white',
		),
	);

	return {
		civicSearchSectionStyleClasses,
		civicSearchShellStyleClasses,
		civicSearchTitleStyleClasses,
		civicSearchControlsStyleClasses,
		civicSearchInputStyleClasses,
		civicSearchFiltersStyleClasses,
		civicSearchFilterItemStyleClasses,
		civicSearchFilterLabelStyleClasses,
		civicSearchApiNoteStyleClasses,
		civicSearchApiNoteLabelStyleClasses,
		civicSearchApiNoteLinkStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
