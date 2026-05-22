// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_HOME_PAGE_CONTENT_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import {
	type CongressionalControlChamber,
	type CongressionalSeat,
	type CongressionalSeatParty,
	type CongressionalSeatSize,
} from './UseCongressionalControlComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type CivicRepresentativeSearchFilterOption = {
	label: string;
	value: string;
};

const getCongressionalSeatRange = ({
	chamberKey,
	party,
	count,
}: {
	chamberKey: CongressionalSeatSize;
	party: CongressionalSeatParty;
	count: number;
}): Array<CongressionalSeat> => {
	return Array.from({ length: count }, (_seat, index) => {
		return {
			id: `${chamberKey}-${party}-${index + 1}`,
			party,
		};
	});
};

const getCongressionalControlPercent = ({
	count,
	totalSeats,
}: {
	count: number;
	totalSeats: number;
}) => {
	return Math.round((count / totalSeats) * 1000) / 10;
};

const getCongressionalSeatCollection = ({
	chamberKey,
	democrats,
	republicans,
	independents,
	vacancies,
}: {
	chamberKey: CongressionalSeatSize;
	democrats: number;
	republicans: number;
	independents: number;
	vacancies: number;
}) => {
	return [
		...getCongressionalSeatRange({
			chamberKey,
			party: 'democrat',
			count: democrats,
		}),
		...getCongressionalSeatRange({
			chamberKey,
			party: 'independent',
			count: independents,
		}),
		...getCongressionalSeatRange({
			chamberKey,
			party: 'vacant',
			count: vacancies,
		}),
		...getCongressionalSeatRange({
			chamberKey,
			party: 'republican',
			count: republicans,
		}),
	];
};

export const UseHomePageContentComposable = () => {
	const civicRepresentativeSearchTitle = 'Find Your Representatives';
	const civicRepresentativeSearchPlaceholder =
		'Search by ZIP, city, state, or representative';
	const civicRepresentativeSearchFilterOptions: Array<CivicRepresentativeSearchFilterOption> =
		[
			{ label: 'Federal', value: 'federal' },
			{ label: 'House', value: 'house' },
			{ label: 'Senate', value: 'senate' },
			{ label: 'State', value: 'state' },
		];

	const civicRepresentativeSearchDefaultFilters: Array<string> = [
		'federal',
		'house',
	];

	const congressionalControlChambers: Array<CongressionalControlChamber> = [
		{
			key: 'house',
			title: 'House Control',
			statusLabel: 'GOP Hold',
			totalSeats: 435,
			democratLabel: 'Democrats',
			democrats: 213,
			republicans: 220,
			independents: 0,
			vacancies: 2,
			democratPercent: getCongressionalControlPercent({
				count: 213,
				totalSeats: 435,
			}),
			republicanPercent: getCongressionalControlPercent({
				count: 220,
				totalSeats: 435,
			}),
			summary: 'Republicans hold the House by 7 seats.',
			pathSummary: 'Democrats need 5 seats to retake control.',
			seats: getCongressionalSeatCollection({
				chamberKey: 'house',
				democrats: 213,
				republicans: 220,
				independents: 0,
				vacancies: 2,
			}),
		},
		{
			key: 'senate',
			title: 'Senate Control',
			statusLabel: 'GOP Edge',
			totalSeats: 100,
			democratLabel: 'Dem + IND caucus',
			democrats: 47,
			republicans: 53,
			independents: 2,
			vacancies: 0,
			democratPercent: getCongressionalControlPercent({
				count: 47,
				totalSeats: 100,
			}),
			republicanPercent: getCongressionalControlPercent({
				count: 53,
				totalSeats: 100,
			}),
			summary: 'Senate control favors Republicans by 6 seats.',
			pathSummary: 'Democratic path to majority: 4 seats.',
			seats: getCongressionalSeatCollection({
				chamberKey: 'senate',
				democrats: 45,
				republicans: 53,
				independents: 2,
				vacancies: 0,
			}),
		},
	];

	return {
		civicRepresentativeSearchTitle,
		civicRepresentativeSearchPlaceholder,
		civicRepresentativeSearchFilterOptions,
		civicRepresentativeSearchDefaultFilters,
		congressionalControlChambers,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
