// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: API > SERVICES
// > REPRESENTATIVES_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '../worker-env';
import type {
	CivicRepresentativeActionResult,
	CivicRepresentativeRecord,
	CivicRepresentativeSearchParams,
	OpenStatesPerson,
} from '../shared';
import { STATUS } from '../shared';
import {
	buildStateRecord,
	fetchAddressLocation,
	fetchStatePeopleByQuery,
	selectFederalRepresentatives,
} from '../data-providers/civicDataProviders';
import {
	readFederalLegislators,
	readStateLegislators,
} from '../representatives-cache/representativesCache';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Validate → locate → fan out (cache + providers) → normalize, all in one place. ---
export const resolveRepresentatives = async (
	env: WorkerEnv,
	searchParams: CivicRepresentativeSearchParams,
): Promise<CivicRepresentativeActionResult> => {
	if (searchParams.query.trim().length === 0) {
		const result: CivicRepresentativeActionResult = {
			success: false,
			statusCode: STATUS.BAD_REQUEST,
			message: 'Enter a ZIP, city, state, address, or representative name.',
		};

		return result;
	}

	if (searchParams.filters.length === 0) {
		const result: CivicRepresentativeActionResult = {
			success: false,
			statusCode: STATUS.BAD_REQUEST,
			message: 'Choose at least one representative filter.',
		};

		return result;
	}

	const wantsFederal = searchParams.filters.some(
		(filter) =>
			filter === 'federal' || filter === 'house' || filter === 'senate',
	);
	const wantsState =
		searchParams.filters.includes('state') && Boolean(env.OPEN_STATES_API_KEY);

	if (searchParams.filters.length === 1 && searchParams.filters.includes('state') && !wantsState) {
		const result: CivicRepresentativeActionResult = {
			success: false,
			statusCode: STATUS.BAD_REQUEST,
			message: 'State representative lookup is unavailable right now.',
		};

		return result;
	}

	try {
		const location = await fetchAddressLocation(env, searchParams);
		const geo =
			location.latitude !== undefined && location.longitude !== undefined;

		const federalPromise: Promise<Array<CivicRepresentativeRecord>> = wantsFederal
			? readFederalLegislators(env).then((legislators) =>
					selectFederalRepresentatives({
						legislators,
						location,
						searchParams,
						imageBaseUrl: env.CONGRESS_LEGISLATOR_IMAGE_BASE_URL,
					}),
				)
			: Promise.resolve([]);

		const statePromise: Promise<Array<OpenStatesPerson>> = !wantsState
			? Promise.resolve([])
			: !geo && location.state
				? readStateLegislators(env, location.state)
				: fetchStatePeopleByQuery(env, { location, searchParams });

		const [federalRecords, statePersons] = await Promise.all([
			federalPromise,
			statePromise,
		]);
		const representatives = [
			...federalRecords,
			...statePersons.map((person) => buildStateRecord(person, location)),
		];

		const result: CivicRepresentativeActionResult =
			representatives.length === 0
				? {
						success: false,
						statusCode: STATUS.NOT_FOUND,
						message: 'No representatives found for that search.',
						civicRepresentatives: { representatives, location },
					}
				: {
						success: true,
						statusCode: STATUS.OK,
						message: 'Representatives loaded.',
						civicRepresentatives: { representatives, location },
					};

		return result;
	} catch (error: unknown) {
		const cause = error instanceof Error ? error.message : String(error);

		console.error(cause);

		const result: CivicRepresentativeActionResult = {
			success: false,
			statusCode: STATUS.INTERNAL_SERVER_ERROR,
			message: 'Representative lookup failed.',
			error: cause,
		};

		return result;
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
