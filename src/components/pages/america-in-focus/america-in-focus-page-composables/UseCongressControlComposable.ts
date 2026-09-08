// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > AMERICA-IN-FOCUS > AMERICA-IN-FOCUS-PAGE-COMPOSABLES
// > USE_CONGRESS_CONTROL_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { storeToRefs } from 'pinia';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
import { useCongressBalanceStore } from '../../../../lib/stores/UseCongressBalanceStore.ts';
import {
	type SeatGridCardModel,
	type SeatGridCardSeatStyleClasses,
} from '../../../shared/seat-grid-card/SeatGridCardTypes.ts';
import type {
	CongressBalance,
	CongressChamberBalance,
} from '../../../../api/models/CongressionalBalanceModel.ts';
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

// --- Create stable seat identities; the collection builder reuses this for each party and vacancy group. ---
const createCongressionalSeatRange = ({
	chamberKey,
	party,
	count,
}: {
	chamberKey: CongressionalSeatSize;
	party: CongressionalSeatParty;
	count: number;
}): Array<CongressionalSeat> => {
	const seats = Array.from({ length: count }, (_seat, index) => {
		const seat: CongressionalSeat = {
			id: `${chamberKey}-${party}-${index + 1}`,
			party,
		};

		return seat;
	});

	return seats;
};

// --- Party counts build the icons; caucus counts are intentionally reserved for control math and bars. ---
const createCongressSeatCollection = (
	chamber: CongressChamberBalance,
): Array<CongressionalSeat> => {
	const seats: Array<CongressionalSeat> = [
		...createCongressionalSeatRange({
			chamberKey: chamber.chamber,
			party: 'democrat',
			count: chamber.democrats,
		}),
		...createCongressionalSeatRange({
			chamberKey: chamber.chamber,
			party: 'independent',
			count: chamber.independents,
		}),
		...createCongressionalSeatRange({
			chamberKey: chamber.chamber,
			party: 'vacant',
			count: chamber.vacancies,
		}),
		...createCongressionalSeatRange({
			chamberKey: chamber.chamber,
			party: 'republican',
			count: chamber.republicans,
		}),
	];

	return seats;
};

// --- Keep displayed percentages at one decimal place without storing duplicate values in the API. ---
const calculateCongressControlPercent = (
	count: number,
	totalSeats: number,
): number => Math.round((count / totalSeats) * 1000) / 10;

// --- Own the political-to-generic-card adapter; SeatGridCard remains reusable and politically unaware. ---
export const UseCongressControlComposable = () => {
	const congressionalBalanceStore = useCongressBalanceStore();
	const { congressionalBalance } = storeToRefs(congressionalBalanceStore);

	const congressControlSectionStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto w-full max-w-[96rem] px-4 py-10',
			'tablet:px-6 tablet:py-14 laptop:py-20',
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

	const congressionalControlSourceStyleClasses = twMerge(
		clsx(
			'mb-5 block text-center text-xs font-semibold tracking-wide',
			'text-slate-600 underline-offset-4 hover:underline',
			'dark:text-slate-300/72 tablet:mb-6 laptop:text-left',
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

	// --- Derive labels, margins, paths, percentages, and every icon from the same Worker snapshot. ---
	const createCongressControlChambers = (
		balance: CongressBalance,
	): Array<CongressionalControlChamber> => {
		const houseMajority = Math.floor(balance.house.totalSeats / 2) + 1;
		const houseRepublicanLead =
			balance.house.republicanCaucus - balance.house.democraticCaucus;
		const houseDemocraticNeed = Math.max(
			0,
			houseMajority - balance.house.democraticCaucus,
		);
		const houseRepublicanNeed = Math.max(
			0,
			houseMajority - balance.house.republicanCaucus,
		);
		const houseStatusLabel =
			houseRepublicanLead > 0
				? 'GOP Hold'
				: houseRepublicanLead < 0
					? 'DEM Hold'
					: 'Even';
		const houseSummary =
			houseRepublicanLead > 0
				? `Republicans hold the House by ${houseRepublicanLead} seats.`
				: houseRepublicanLead < 0
					? `Democrats hold the House by ${Math.abs(houseRepublicanLead)} seats.`
					: 'House control is evenly split.';
		const housePathSummary =
			houseRepublicanLead > 0
				? `Democrats need ${houseDemocraticNeed} seats to retake control.`
				: houseRepublicanLead < 0
					? `Republicans need ${houseRepublicanNeed} seats to retake control.`
					: 'Both parties need 1 seat to take control.';

		const senateMajority = Math.floor(balance.senate.totalSeats / 2) + 1;
		const senateRepublicanLead =
			balance.senate.republicanCaucus - balance.senate.democraticCaucus;
		const senateDemocraticNeed = Math.max(
			0,
			senateMajority - balance.senate.democraticCaucus,
		);
		const senateRepublicanNeed = Math.max(
			0,
			senateMajority - balance.senate.republicanCaucus,
		);
		const senateStatusLabel =
			senateRepublicanLead > 0
				? 'GOP Edge'
				: senateRepublicanLead < 0
					? 'DEM Edge'
					: 'Even';
		const senateSummary =
			senateRepublicanLead > 0
				? `Senate control favors Republicans by ${senateRepublicanLead} seats.`
				: senateRepublicanLead < 0
					? `Senate control favors Democrats by ${Math.abs(senateRepublicanLead)} seats.`
					: 'Senate control is evenly split.';
		const senatePathSummary =
			senateRepublicanLead > 0
				? `Democratic path to majority: ${senateDemocraticNeed} seats.`
				: senateRepublicanLead < 0
					? `Republican path to majority: ${senateRepublicanNeed} seats.`
					: 'Both parties need 1 seat for a majority.';

		const chambers: Array<CongressionalControlChamber> = [
			{
				key: 'house',
				title: 'House Control',
				statusLabel: houseStatusLabel,
				totalSeats: balance.house.totalSeats,
				democratLabel: 'Democrats',
				democrats: balance.house.democraticCaucus,
				republicans: balance.house.republicanCaucus,
				independents: balance.house.independents,
				vacancies: balance.house.vacancies,
				democratPercent: calculateCongressControlPercent(
					balance.house.democraticCaucus,
					balance.house.totalSeats,
				),
				republicanPercent: calculateCongressControlPercent(
					balance.house.republicanCaucus,
					balance.house.totalSeats,
				),
				summary: houseSummary,
				pathSummary: housePathSummary,
				seats: createCongressSeatCollection(balance.house),
			},
			{
				key: 'senate',
				title: 'Senate Control',
				statusLabel: senateStatusLabel,
				totalSeats: balance.senate.totalSeats,
				democratLabel: 'Dem + IND caucus',
				democrats: balance.senate.democraticCaucus,
				republicans: balance.senate.republicanCaucus,
				independents: balance.senate.independents,
				vacancies: balance.senate.vacancies,
				democratPercent: calculateCongressControlPercent(
					balance.senate.democraticCaucus,
					balance.senate.totalSeats,
				),
				republicanPercent: calculateCongressControlPercent(
					balance.senate.republicanCaucus,
					balance.senate.totalSeats,
				),
				summary: senateSummary,
				pathSummary: senatePathSummary,
				seats: createCongressSeatCollection(balance.senate),
			},
		];

		return chambers;
	};

	// --- Convert the political view model into the generic SeatGridCard contract. ---
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

	// ---
	// The network fill is asynchronous; every card value is then
	// synchronously derived from this one Pinia snapshot.
	// ---
	const congressionalControlChambers = computed(() => {
		if (!congressionalBalance.value) {
			return [];
		}

		const chambers = createCongressControlChambers(
			congressionalBalance.value,
		);

		return chambers;
	});

	// --- Keep provenance visible after the temporary toast is gone so the live counts remain auditable. ---
	const congressionalBalanceSourceCaption = computed(() => {
		const balance = congressionalBalance.value;

		if (!balance) {
			return '';
		}

		const updatedOn = new Date(balance.fetchedAt).toLocaleDateString();
		const caption = `Source: ${balance.source} · updated ${updatedOn}`;

		return caption;
	});

	const congressionalBalanceSourceUrl = computed(() => {
		return congressionalBalance.value?.sourceUrl ?? '';
	});

	return {
		congressionalControlSectionStyleClasses:
			congressControlSectionStyleClasses,
		congressionalControlShellStyleClasses,
		congressionalControlHeaderStyleClasses,
		congressionalControlEyebrowStyleClasses,
		congressionalControlTitleStyleClasses,
		congressionalControlLeadStyleClasses,
		congressionalControlSourceStyleClasses,
		congressionalControlGridStyleClasses,
		createCongressControlChambers,
		getCongressionalSeatGridCards,
		congressionalControlChambers,
		congressionalBalanceSourceCaption,
		congressionalBalanceSourceUrl,
		congressionalBalanceStore,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
