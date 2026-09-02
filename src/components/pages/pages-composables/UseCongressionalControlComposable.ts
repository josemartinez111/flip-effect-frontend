// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_CONGRESSIONAL_CONTROL_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	type SeatGridCardModel,
	type SeatGridCardSeatStyleClasses,
} from '../../shared/seat-grid-card/SeatGridCardTypes.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressionalSeatParty =
	'democrat' | 'republican' | 'independent' | 'vacant';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressionalSeatSize = 'house' | 'senate';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressionalSeat = {
	id: string;
	party: CongressionalSeatParty;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

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
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseCongressionalControlComposable = () => {
	const congressionalControlSectionStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto w-full max-w-[96rem] px-4 pb-12',
			'tablet:px-6 tablet:pb-16',
			'laptop:-mt-44 laptop:pb-32',
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

	const congressionalSeatStyleClasses: Record<
		CongressionalSeatParty,
		SeatGridCardSeatStyleClasses
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

	const getCongressionalSeatGridCards = (
		chambers: Array<CongressionalControlChamber>,
	): Array<SeatGridCardModel> => {
		const seatGridCards: Array<SeatGridCardModel> = chambers.map(
			(chamber: CongressionalControlChamber) => {
				const metadata = [
					{
						key: 'total-seats',
						label: `${chamber.totalSeats} seats`,
					},
				];

				if (chamber.independents > 0) {
					metadata.push({
						key: 'independent-seats',
						label: `${chamber.independents} IND shown separately`,
					});
				}

				if (chamber.vacancies > 0) {
					metadata.push({
						key: 'vacant-seats',
						label: `${chamber.vacancies} vacancies`,
					});
				}

				const seatGridCard: SeatGridCardModel = {
					key: chamber.key,
					title: chamber.title,
					statusLabel: chamber.statusLabel,
					summary: chamber.summary,
					highlight: chamber.pathSummary,
					layout: chamber.key === 'house' ? 'dense' : 'standard',
					seatAvatarSize: chamber.key === 'house' ? 'small' : 'medium',
					seatGridAriaLabel: `${chamber.title} seats`,
					bars: [
						{
							key: 'democrat-seats',
							label: chamber.democratLabel,
							count: chamber.democrats,
							percentage: chamber.democratPercent,
							styleClasses: 'from-blue-700 via-sky-500 to-cyan-300',
						},
						{
							key: 'republican-seats',
							label: 'Republicans',
							count: chamber.republicans,
							percentage: chamber.republicanPercent,
							styleClasses: 'from-rose-800 via-red-600 to-rose-300',
						},
					],
					metadata,
					seats: chamber.seats.map((seat: CongressionalSeat) => {
						const seatGridSeat = {
							id: seat.id,
							ariaLabel: `${seat.party} congressional seat`,
							styleClasses: congressionalSeatStyleClasses[seat.party],
						};

						return seatGridSeat;
					}),
				};

				return seatGridCard;
			},
		);

		return seatGridCards;
	};

	return {
		congressionalControlSectionStyleClasses,
		congressionalControlShellStyleClasses,
		congressionalControlHeaderStyleClasses,
		congressionalControlEyebrowStyleClasses,
		congressionalControlTitleStyleClasses,
		congressionalControlLeadStyleClasses,
		congressionalControlGridStyleClasses,
		getCongressionalSeatGridCards,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
