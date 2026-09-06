// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_HOME_PAGE_CONTENT_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
type CivicRepSearchFilterValue = 'federal' | 'state' | 'all';

type CivicRepSearchFilterOption = {
	label: string;
	value: CivicRepSearchFilterValue;
	description: string;
	helpText: string;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// --- Static page copy stays here; live congressional calculations belong to its dedicated adapter and store. ---
export const UseHomePageContentComposable = () => {
	const civicRepresentativeSearchTitle = 'Find Your Representatives';
	const civicRepresentativeSearchPlaceholder = 'Search by ZIP, city, state, or representative';

	const civicRepresentativeSearchFilterOptions: Array<CivicRepSearchFilterOption> =
		[
			{
				label: 'US Congress',
				value: 'federal',
				description: 'House + Senate',
				helpText:
					'Congress means your U.S. House representative and your two U.S. senators in Washington, DC.',
			},
			{
				label: 'State Lawmakers',
				value: 'state',
				description: 'Your state capitol',
				helpText:
					'State lawmakers are your state capitol representatives, usually a state House or Assembly member and a state senator.',
			},
			{
				label: 'Both Levels',
				value: 'all',
				description: 'Congress + state',
				helpText:
					'Both Levels searches Congress and state lawmakers together, so you can see both systems.',
			},
		];

	const civicRepresentativeSearchDefaultFilters: Array<CivicRepSearchFilterValue> = ['federal'];

	return {
		civicRepresentativeSearchTitle,
		civicRepresentativeSearchPlaceholder,
		civicRepresentativeSearchFilterOptions,
		civicRepresentativeSearchDefaultFilters,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
