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
			'mx-auto flex flex-1 min-w-0 flex-col gap-2 rounded-2xl border px-4 py-2',
			'border-white/90 bg-white/82 shadow-[0_18px_46px_rgba(15,23,42,0.16)]',
			'backdrop-blur-xl',
			'dark:border-white/10 dark:bg-slate-950/42 dark:shadow-black/40',
		),
	);

	const civicSearchTitleStyleClasses = twMerge(
		clsx(
			'text-center font-orbitron text-sm font-black uppercase',
			'tracking-[0.24em] text-cyan-900 tablet:text-base',
			'drop-shadow-none',
			'dark:text-cyan-100 dark:drop-shadow-[0_0_18px_rgba(125,211,252,0.72)]',
		),
	);

	const civicSearchControlsStyleClasses = twMerge(
		clsx(
			'grid gap-2 tablet:grid-cols-[minmax(0,1fr)_auto] laptop:grid-cols-[minmax(0,1fr)_auto_auto]',
			'tablet:items-center',
		),
	);

	const civicSearchInputStyleClasses = twMerge(
		clsx(
			'h-10 w-full rounded-xl border px-4 font-bold text-slate-950',
			'border-slate-300/90 bg-white/94 shadow-[inset_0_1px_3px_rgba(15,23,42,0.12),0_10px_22px_rgba(15,23,42,0.08)]',
			'placeholder:text-slate-500 focus:shadow-[inset_0_1px_3px_rgba(15,23,42,0.12),0_0_0_3px_rgba(14,165,233,0.16)]',
			'focus:outline-none',
			'dark:border-white/10 dark:bg-slate-950/58 dark:text-white',
			'dark:placeholder:text-slate-300/70 dark:focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.35),0_0_0_3px_rgba(103,232,249,0.16)]',
		),
	);

	const civicSearchSearchButtonStyleClasses = twMerge(
		clsx(
			'h-9 cursor-pointer rounded-xl border px-4',
			'border-cyan-600/24 bg-cyan-400/18',
			'font-orbitron text-[0.68rem] font-black uppercase tracking-[0.14em]',
			'text-cyan-800 shadow-[0_10px_22px_rgba(14,165,233,0.12)]',
			'transition duration-200 hover:border-cyan-400/70 hover:bg-cyan-300/24',
			'disabled:cursor-wait disabled:opacity-60',
			'dark:border-cyan-200/18 dark:bg-cyan-300/12 dark:text-cyan-100',
			'dark:shadow-[0_10px_24px_rgba(103,232,249,0.08)]',
		),
	);

	const civicSearchFiltersStyleClasses = twMerge(
		clsx(
			'flex flex-wrap items-center justify-center gap-x-4 gap-y-2',
			'tablet:justify-end',
		),
	);

	const civicSearchFilterButtonStyleClasses = (selected: boolean) => {
		const styleClasses = twMerge(
			clsx(
				'flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-2 py-1',
				'font-orbitron font-black uppercase',
				'transition duration-200',
				selected
					? 'border-cyan-500/55 bg-white/86 text-cyan-950 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] dark:bg-white/8 dark:text-cyan-100'
					: 'border-slate-500/28 bg-white/70 text-slate-900 hover:border-cyan-500/58 hover:text-cyan-950 dark:border-white/10 dark:bg-white/6 dark:text-slate-200/82 dark:hover:text-cyan-100',
			),
		);

		return styleClasses;
	};

	const civicSearchFilterCopyStyleClasses = twMerge(
		clsx('flex min-w-0 flex-col items-start leading-none'),
	);

	const civicSearchFilterTitleStyleClasses = twMerge(
		clsx('text-[0.58rem] tracking-[0.1em] tablet:text-[0.62rem]'),
	);

	const civicSearchFilterDescriptionStyleClasses = twMerge(
		clsx(
			'mt-1 text-[0.46rem] font-black tracking-[0.08em] text-slate-700',
			'dark:text-slate-300/70',
		),
	);

	const civicSearchFilterMarkerStyleClasses = (selected: boolean) => {
		const styleClasses = twMerge(
			clsx(
				'h-3.5 w-3.5 shrink-0 rounded border transition duration-200',
				selected
					? 'border-cyan-500 bg-cyan-400 shadow-[0_0_12px_rgba(14,165,233,0.34)]'
					: 'border-slate-500/40 bg-slate-950/92 dark:border-white/18 dark:bg-black',
			),
		);

		return styleClasses;
	};

	const civicSearchMessageStyleClasses = (success: boolean) => {
		const styleClasses = twMerge(
			clsx(
				'rounded-xl border px-3 py-2 text-xs font-bold leading-5',
				'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
				success
					? 'border-cyan-800/22 bg-cyan-50/86 text-slate-950 dark:border-cyan-200/12 dark:bg-slate-950/46 dark:text-slate-200/82'
					: 'border-flipeffect-rose-bright/30 bg-flipeffect-rose-bright/10 text-rose-900 dark:text-rose-100',
			),
		);

		return styleClasses;
	};

	const civicSearchApiNoteStyleClasses = twMerge(
		clsx(
			'rounded-xl border px-3 py-1.5 text-xs font-bold leading-5',
			'border-cyan-800/22 bg-cyan-50/86 text-slate-950',
			'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
			'dark:border-cyan-200/12 dark:bg-slate-950/46 dark:text-slate-200/82',
		),
	);

	const civicSearchApiNoteLabelStyleClasses = twMerge(
		clsx(
			'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.14em]',
			'text-cyan-900 dark:text-cyan-100',
		),
	);

	const civicSearchApiNoteListStyleClasses = twMerge(
		clsx('mt-1 grid gap-x-3 gap-y-1 tablet:grid-cols-3'),
	);

	const civicSearchApiNoteItemStyleClasses = twMerge(
		clsx('grid gap-0.5'),
	);

	const civicSearchApiNoteCopyStyleClasses = twMerge(
		clsx('text-[0.68rem] font-extrabold leading-4 text-slate-950 dark:text-slate-200/82'),
	);

	const civicSearchResultsModalRootStyleClasses = twMerge(
		clsx(
			'w-[min(94vw,72rem)] border-cyan-700/18 bg-white text-slate-950',
			'dark:border-cyan-100/12 dark:bg-slate-950',
		),
	);

	const civicSearchResultsModalContentStyleClasses = twMerge(
		clsx('max-h-[min(82vh,48rem)] overflow-y-auto px-4 py-4'),
	);

	const civicSearchResultsHeaderStyleClasses = twMerge(
		clsx(
			'mb-4 flex flex-col gap-2 tablet:flex-row tablet:items-end',
			'tablet:justify-between',
		),
	);

	const civicSearchResultsCountStyleClasses = twMerge(
		clsx(
			'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.14em]',
			'text-cyan-900 dark:text-cyan-100',
		),
	);

	const civicSearchResultsGridStyleClasses = twMerge(
		clsx('grid gap-3 tablet:grid-cols-2 laptop:grid-cols-3'),
	);

	const civicSearchResultCardStyleClasses = twMerge(
		clsx(
			'overflow-hidden rounded-xl border border-slate-300/90 bg-white/96',
			'shadow-xl shadow-slate-950/8',
			'dark:border-white/10 dark:bg-white/6 dark:shadow-black/25',
		),
	);

	const civicSearchResultImageStyleClasses = twMerge(
		clsx(
			'h-44 w-full bg-slate-950/8 object-contain object-center',
			'dark:bg-black/30',
		),
	);

	const civicSearchResultCardBodyStyleClasses = twMerge(
		clsx('grid gap-3 px-4 py-4'),
	);

	const civicSearchResultMetaStyleClasses = twMerge(
		clsx('flex flex-wrap items-center gap-2'),
	);

	const civicSearchResultPartyStyleClasses = twMerge(
		clsx(
			'rounded-md border border-cyan-800/20 bg-cyan-100/72 px-2 py-1',
			'font-orbitron text-[0.58rem] font-black uppercase tracking-[0.13em]',
			'text-cyan-950 dark:border-cyan-200/14 dark:bg-cyan-400/12 dark:text-cyan-100',
		),
	);

	const civicSearchResultNameStyleClasses = twMerge(
		clsx(
			'font-orbitron text-lg font-black uppercase leading-tight',
			'text-slate-950 dark:text-white',
		),
	);

	const civicSearchResultInfoStyleClasses = twMerge(
		clsx('text-sm font-extrabold leading-6 text-slate-900 dark:text-slate-200/82'),
	);

	const civicSearchResultLinksStyleClasses = twMerge(
		clsx('flex flex-wrap gap-2 pt-1'),
	);

	const civicSearchResultLinkStyleClasses = twMerge(
		clsx(
			'cursor-pointer rounded-lg border border-cyan-800/24 px-3 py-2',
			'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.12em]',
			'text-cyan-950 transition hover:border-cyan-500/70 hover:bg-cyan-100/70',
			'dark:border-cyan-200/14 dark:text-cyan-100 dark:hover:bg-cyan-300/10',
		),
	);

	return {
		civicSearchSectionStyleClasses,
		civicSearchShellStyleClasses,
		civicSearchTitleStyleClasses,
		civicSearchControlsStyleClasses,
		civicSearchInputStyleClasses,
		civicSearchSearchButtonStyleClasses,
		civicSearchFiltersStyleClasses,
		civicSearchFilterButtonStyleClasses,
		civicSearchFilterCopyStyleClasses,
		civicSearchFilterTitleStyleClasses,
		civicSearchFilterDescriptionStyleClasses,
		civicSearchFilterMarkerStyleClasses,
		civicSearchMessageStyleClasses,
		civicSearchApiNoteStyleClasses,
		civicSearchApiNoteLabelStyleClasses,
		civicSearchApiNoteListStyleClasses,
		civicSearchApiNoteItemStyleClasses,
		civicSearchApiNoteCopyStyleClasses,
		civicSearchResultsModalRootStyleClasses,
		civicSearchResultsModalContentStyleClasses,
		civicSearchResultsHeaderStyleClasses,
		civicSearchResultsCountStyleClasses,
		civicSearchResultsGridStyleClasses,
		civicSearchResultCardStyleClasses,
		civicSearchResultImageStyleClasses,
		civicSearchResultCardBodyStyleClasses,
		civicSearchResultMetaStyleClasses,
		civicSearchResultPartyStyleClasses,
		civicSearchResultNameStyleClasses,
		civicSearchResultInfoStyleClasses,
		civicSearchResultLinksStyleClasses,
		civicSearchResultLinkStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
