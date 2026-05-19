// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                    USE_HOME_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ref } from 'vue';
import { formatDate, getCountdownTimeLeft } from '../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseHomeComposable = () => {
	const MIDTERMS_DATE = '2026-11-03T00:00:00-05:00';
	let midtermsCountdownIntervalId: number | undefined;

	const midtermsCountdown = ref(
		getCountdownTimeLeft({ targetDate: MIDTERMS_DATE }),
	);

	const midtermsDateLabel = formatDate('long', MIDTERMS_DATE);

	const syncMidtermsCountdown = () => {
		midtermsCountdown.value = getCountdownTimeLeft({
			targetDate: MIDTERMS_DATE,
		});
	};

	const startMidtermsCountdown = () => {
		syncMidtermsCountdown();
		midtermsCountdownIntervalId = window.setInterval(
			syncMidtermsCountdown,
			1000,
		);
	};

	const stopMidtermsCountdown = () => {
		if (midtermsCountdownIntervalId !== undefined) {
			window.clearInterval(midtermsCountdownIntervalId);
			midtermsCountdownIntervalId = undefined;
		}
	};

	const mainContainerStyleClasses = twMerge(
		clsx(
			'relative min-h-screen w-full overflow-hidden',
			'bg-transparent text-slate-950',
			'dark:text-white',
		),
	);
	
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
		clsx('grid gap-3 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-center'),
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

	const heroSectionStyleClasses = twMerge(
		clsx(
			'relative isolate flex min-h-[calc(100vh-4rem)] items-center',
			'px-5 pb-20 pt-40 tablet:px-8 tablet:pt-36 laptop:pb-24 laptop:pt-34',
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

	const branchesTriggerButtonStyleClasses = twMerge(
		clsx(
			'absolute right-4 top-4 z-30 flex h-40 w-28 cursor-pointer overflow-hidden',
			'items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-200 hover:scale-[1.03] hover:opacity-90',
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
		clsx(
			'relative overflow-hidden bg-transparent shadow-none',
		),
	);

	const branchesModalRootStyleClasses = twMerge(
		clsx(
			'w-auto border-none bg-transparent shadow-none',
			'dark:border-none dark:bg-transparent dark:shadow-none',
		),
	);

	const branchesModalContentWrapperStyleClasses = twMerge(
		clsx('max-h-[90vh] bg-transparent p-0'),
	);

	const branchesModalCardBodyStyleClasses = twMerge(clsx('p-0'));

	const branchesModalCardContentStyleClasses = twMerge(clsx('relative p-0'));

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

	const congressionalControlSectionStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto w-full max-w-[96rem] px-4 pb-24',
			'-mt-32 tablet:px-6 tablet:-mt-36 laptop:-mt-44 laptop:pb-32',
		),
	);

	const congressionalControlShellStyleClasses = twMerge(
		clsx(
			'rounded-2xl border px-4 py-5 shadow-2xl backdrop-blur-xl',
			'border-white/75 bg-white/58 shadow-slate-950/14',
			'dark:border-white/10 dark:bg-slate-950/48 dark:shadow-black/42',
			'tablet:px-6 tablet:py-6',
		),
	);

	const congressionalControlHeaderStyleClasses = twMerge(
		clsx(
			'mb-5 flex flex-col gap-2 text-center tablet:mb-6',
			'laptop:flex-row laptop:items-end laptop:justify-between laptop:text-left',
		),
	);

	const congressionalControlEyebrowStyleClasses = twMerge(
		clsx(
			'font-orbitron text-base font-black uppercase tracking-[0.24em]',
			'text-cyan-700 drop-shadow-[0_0_16px_rgba(14,165,233,0.32)]',
			'dark:text-cyan-100 dark:drop-shadow-[0_0_18px_rgba(125,211,252,0.68)]',
			'tablet:text-xl',
		),
	);

	const congressionalControlTitleStyleClasses = twMerge(
		clsx(
			'font-orbitron text-2xl font-black uppercase tracking-normal',
			'text-slate-950 drop-shadow-[0_0_18px_rgba(14,165,233,0.18)]',
			'dark:text-white dark:drop-shadow-[0_0_18px_rgba(125,211,252,0.32)]',
			'tablet:text-3xl',
		),
	);

	const congressionalControlLeadStyleClasses = twMerge(
		clsx(
			'max-w-2xl text-sm font-semibold leading-6',
			'text-slate-700 dark:text-slate-200/78',
		),
	);

	const congressionalControlGridStyleClasses = twMerge(
		clsx('grid gap-4 laptop:grid-cols-2'),
	);

	const congressionalChamberCardStyleClasses = twMerge(
		clsx(
			'overflow-hidden rounded-xl border bg-transparent shadow-xl',
			'border-slate-900/8 shadow-slate-950/12',
			'dark:border-white/10 dark:shadow-black/35',
		),
	);

	const congressionalChamberCardBodyStyleClasses = twMerge(clsx('p-0'));

	const congressionalChamberCardContentStyleClasses = twMerge(
		clsx(
			'bg-gradient-to-br from-white/72 via-white/54 to-slate-200/50 p-4',
			'dark:from-slate-950/84 dark:via-slate-900/68 dark:to-slate-950/84',
			'tablet:p-5',
		),
	);

	const congressionalChamberHeaderStyleClasses = twMerge(
		clsx('mb-4 flex items-start justify-between gap-3'),
	);

	const congressionalChamberTitleStyleClasses = twMerge(
		clsx(
			'font-orbitron text-lg font-black uppercase tracking-[0.08em]',
			'text-slate-950 dark:text-white',
		),
	);

	const congressionalChamberStatusStyleClasses = twMerge(
		clsx(
			'rounded-md border px-2 py-1 font-orbitron text-[0.62rem] font-black',
			'uppercase tracking-[0.16em]',
			'border-rose-500/25 bg-rose-500/12 text-rose-700',
			'dark:border-rose-300/22 dark:bg-rose-400/12 dark:text-rose-200',
		),
	);

	const congressionalChamberSummaryStyleClasses = twMerge(
		clsx('space-y-1 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200/82'),
	);

	const congressionalChamberPathStyleClasses = twMerge(
		clsx('text-cyan-700 dark:text-cyan-100'),
	);

	const congressionalPartyBarsStyleClasses = twMerge(
		clsx('mt-4 space-y-3'),
	);

	const congressionalPartyBarRowStyleClasses = twMerge(
		clsx('grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-3'),
	);

	const congressionalPartyBarLabelStyleClasses = twMerge(
		clsx(
			'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.12em]',
			'text-slate-600 dark:text-slate-300/82',
		),
	);

	const congressionalPartyBarTrackStyleClasses = twMerge(
		clsx(
			'h-2 overflow-hidden rounded-full bg-slate-950/10',
			'shadow-[inset_0_1px_4px_rgba(15,23,42,0.18)]',
			'dark:bg-white/10 dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.45)]',
		),
	);

	const congressionalPartyBarCountStyleClasses = twMerge(
		clsx(
			'text-right font-orbitron text-xs font-black',
			'text-slate-700 dark:text-slate-100',
		),
	);

	const congressionalDemocratBarStyleClasses = twMerge(
		clsx('h-full rounded-full bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-300'),
	);

	const congressionalRepublicanBarStyleClasses = twMerge(
		clsx('h-full rounded-full bg-gradient-to-r from-rose-800 via-red-600 to-rose-300'),
	);

	const congressionalChamberMetaStyleClasses = twMerge(
		clsx(
			'mt-4 flex flex-wrap gap-2 font-orbitron text-[0.62rem] font-bold',
			'uppercase tracking-[0.12em]',
		),
	);

	const congressionalChamberMetaItemStyleClasses = twMerge(
		clsx(
			'rounded-md border px-2 py-1',
			'border-slate-900/10 bg-white/48 text-slate-700',
			'dark:border-white/10 dark:bg-white/6 dark:text-slate-200/78',
		),
	);

	const congressionalSeatGridStyleClasses = twMerge(
		clsx(
			'mt-5 grid content-start justify-items-center gap-x-1.5 gap-y-2',
			'rounded-xl border p-3',
			'border-slate-950/8 bg-slate-950/6',
			'dark:border-white/8 dark:bg-black/18',
		),
	);

	const congressionalHouseSeatGridStyleClasses = twMerge(
		clsx(
			congressionalSeatGridStyleClasses,
			'grid-cols-[repeat(29,minmax(0,1fr))] tablet:grid-cols-[repeat(35,minmax(0,1fr))]',
		),
	);

	const congressionalSenateSeatGridStyleClasses = twMerge(
		clsx(
			congressionalSeatGridStyleClasses,
			'grid-cols-[repeat(20,minmax(0,1fr))] tablet:grid-cols-[repeat(25,minmax(0,1fr))]',
		),
	);

	return {
		mainContainerStyleClasses,
		civicSearchSectionStyleClasses,
		civicSearchShellStyleClasses,
		civicSearchTitleStyleClasses,
		civicSearchControlsStyleClasses,
		civicSearchInputStyleClasses,
		civicSearchFiltersStyleClasses,
		civicSearchFilterItemStyleClasses,
		civicSearchFilterLabelStyleClasses,
		heroSectionStyleClasses,
		heroContentContainerStyleClasses,
		heroCopyContainerStyleClasses,
		homeTitleStyleClasses,
		heroLeadStyleClasses,
		heroCardShellStyleClasses,
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
		branchesTriggerButtonStyleClasses,
		branchesTriggerImageStyleClasses,
		branchesModalRootStyleClasses,
		branchesModalContentWrapperStyleClasses,
		branchesModalCardStyleClasses,
		branchesModalCardBodyStyleClasses,
		branchesModalCardContentStyleClasses,
		branchesModalBgImageStyleClasses,
		branchesModalImageStyleClasses,
		congressionalControlSectionStyleClasses,
		congressionalControlShellStyleClasses,
		congressionalControlHeaderStyleClasses,
		congressionalControlEyebrowStyleClasses,
		congressionalControlTitleStyleClasses,
		congressionalControlLeadStyleClasses,
		congressionalControlGridStyleClasses,
		congressionalChamberCardStyleClasses,
		congressionalChamberCardBodyStyleClasses,
		congressionalChamberCardContentStyleClasses,
		congressionalChamberHeaderStyleClasses,
		congressionalChamberTitleStyleClasses,
		congressionalChamberStatusStyleClasses,
		congressionalChamberSummaryStyleClasses,
		congressionalChamberPathStyleClasses,
		congressionalPartyBarsStyleClasses,
		congressionalPartyBarRowStyleClasses,
		congressionalPartyBarLabelStyleClasses,
		congressionalPartyBarTrackStyleClasses,
		congressionalPartyBarCountStyleClasses,
		congressionalDemocratBarStyleClasses,
		congressionalRepublicanBarStyleClasses,
		congressionalChamberMetaStyleClasses,
		congressionalChamberMetaItemStyleClasses,
		congressionalHouseSeatGridStyleClasses,
		congressionalSenateSeatGridStyleClasses,
		midtermsCountdown,
		midtermsDateLabel,
		startMidtermsCountdown,
		stopMidtermsCountdown,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
