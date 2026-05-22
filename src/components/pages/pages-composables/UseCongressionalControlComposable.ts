// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_CONGRESSIONAL_CONTROL_COMPOSABLE.TS 
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressionalSeatParty =
	| 'democrat'
	| 'republican'
	| 'independent'
	| 'vacant';

export type CongressionalSeatSize = 'house' | 'senate';

export type CongressionalSeat = {
	id: string;
	party: CongressionalSeatParty;
};

export type CongressionalControlChamber = {
	key: CongressionalSeatSize;
	title: string;
	statusLabel: string;
	totalSeats: number;
	democratLabel: string;
	democrats: number;
	republicans: number;
	independents: number;
	vacancies: number;
	democratPercent: number;
	republicanPercent: number;
	summary: string;
	pathSummary: string;
	seats: Array<CongressionalSeat>;
};

type CongressionalSeatAvatarStyleClasses = {
	seatBackStyleClasses: string;
	seatHeadStyleClasses: string;
	seatBaseStyleClasses: string;
	iconStyleClasses?: string;
	hideIcon?: boolean;
};

export const UseCongressionalControlComposable = () => {
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
		clsx(
			'space-y-1 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200/82',
		),
	);

	const congressionalChamberPathStyleClasses = twMerge(
		clsx('text-cyan-700 dark:text-cyan-100'),
	);

	const congressionalPartyBarsStyleClasses = twMerge(clsx('mt-4 space-y-3'));

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
		clsx(
			'h-full rounded-full bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-300',
		),
	);

	const congressionalRepublicanBarStyleClasses = twMerge(
		clsx(
			'h-full rounded-full bg-gradient-to-r from-rose-800 via-red-600 to-rose-300',
		),
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

	const congressionalSeatAvatarStyleClasses: Record<
		CongressionalSeatParty,
		CongressionalSeatAvatarStyleClasses
	> = {
		democrat: {
			seatBackStyleClasses:
				'border-cyan-200/70 bg-blue-700 shadow-blue-500/35',
			seatHeadStyleClasses:
				'border-cyan-100/80 bg-cyan-200 text-blue-950 shadow-cyan-300/40',
			seatBaseStyleClasses: 'bg-blue-950/80',
		},
		republican: {
			seatBackStyleClasses:
				'border-rose-200/70 bg-rose-800 shadow-rose-500/35',
			seatHeadStyleClasses:
				'border-rose-100/80 bg-rose-200 text-rose-950 shadow-rose-300/40',
			seatBaseStyleClasses: 'bg-rose-950/80',
		},
		independent: {
			seatBackStyleClasses:
				'border-violet-200/70 bg-violet-700 shadow-violet-500/35',
			seatHeadStyleClasses:
				'border-violet-100/80 bg-violet-200 text-violet-950 shadow-violet-300/40',
			seatBaseStyleClasses: 'bg-violet-950/80',
		},
		vacant: {
			seatBackStyleClasses:
				'border-slate-300/55 bg-slate-600/58 shadow-slate-500/10',
			seatHeadStyleClasses:
				'border-slate-300/55 bg-slate-400/45 text-slate-700/60 shadow-none',
			seatBaseStyleClasses: 'bg-slate-500/40',
			hideIcon: true,
		},
	};

	const getCongressionalControlBarStyle = (percentage: number) => {
		return {
			width: `${percentage}%`,
		};
	};

	const getCongressionalSeatAvatarSize = (
		chamberKey: CongressionalSeatSize,
	) => {
		return chamberKey === 'house' ? 'small' : 'medium';
	};

	const getCongressionalSeatAvatarAriaLabel = (
		party: CongressionalSeatParty,
	) => {
		return `${party} congressional seat`;
	};

	return {
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
		congressionalSeatAvatarStyleClasses,
		getCongressionalControlBarStyle,
		getCongressionalSeatAvatarSize,
		getCongressionalSeatAvatarAriaLabel,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
