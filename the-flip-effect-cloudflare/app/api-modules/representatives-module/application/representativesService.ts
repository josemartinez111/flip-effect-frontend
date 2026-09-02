// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > APPLICATION
// > REPRESENTATIVES_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type {
	CivicRepresentativeActionResult,
	CivicRepresentativeRecord,
	CivicRepresentativeSearchFilter,
	CivicRepresentativeSearchParams,
} from '@representatives-module/domain/representativeModel';
import type { OpenStatesPerson } from '@representatives-module/domain/civicUpstreamModel';
import {
	buildStateRecord,
	fetchAddressLocation,
	fetchStatePeopleByDistricts,
	fetchStatePeopleByQuery,
	selectFederalRepresentatives,
	selectStateRepresentatives,
} from '@representatives-module/infrastructure/civicDataProviders';
import {
	fetchCachedStateLegislators,
	readFederalLegislators,
} from '@representatives-module/infrastructure/representativesCache';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Validate → locate → fan out (cache + providers) → normalize, all in one place. ---
export const fetchRepresentativesBySearch = async (
	env: WorkerEnv,
	searchParams: CivicRepresentativeSearchParams,
): Promise<CivicRepresentativeActionResult> => {
	// --- Capability flags first (the validation table + fan-out below both read these). ---
	const wantsFederal: boolean = searchParams.filters.some(
		(filter: CivicRepresentativeSearchFilter) =>
			filter === 'federal' || filter === 'house' || filter === 'senate',
	);

	const wantsState =
		searchParams.filters.includes('state') &&
		Boolean(env.OPEN_STATES_API_KEY);
	// --- Named so the rule reads as intent: the *only* filter asked for is state, and state is down. ---
	const onlyStateUnavailable =
		searchParams.filters.length === 1 &&
		searchParams.filters.includes('state') &&
		!wantsState;

	// --- One bad-request shape; each rule supplies its message. First failing rule wins. ---
	const validationRules: Array<{ invalid: boolean; message: string }> = [
		{
			invalid: searchParams.query.trim().length === 0,
			message:
				'Enter a ZIP, city, state, address, or representative name.',
		},
		{
			invalid: searchParams.filters.length === 0,
			message: 'Choose at least one representative filter.',
		},
		{
			invalid: onlyStateUnavailable,
			message: 'State representative lookup is unavailable right now.',
		},
	];

	const failure = validationRules.find(
		(rule: { invalid: boolean; message: string }) => rule.invalid,
	);

	if (failure) {
		const result: CivicRepresentativeActionResult = {
			success: false,
			statusCode: STATUS.BAD_REQUEST,
			message: failure.message,
		};

		return result;
	}

	try {
		// --- Resolve the query into a location (state, district, coords) before fanning out. ---
		const location = await fetchAddressLocation(env, searchParams);

		// --- Two acquisition paths, run in parallel; each guards to [] when its filter is off. ---
		const loadFederalRecords = async (): Promise<
			Array<CivicRepresentativeRecord>
		> => {
			// --- Federal not requested → skip the blob fetch entirely. ---
			if (!wantsFederal) {
				return [];
			}

			// --- Read-through KV for the congress-legislators blob, then match it to this location. ---
			const legislators = await readFederalLegislators(env);

			return selectFederalRepresentatives({
				legislators,
				location,
				searchParams,
				imageBaseUrl: env.CONGRESS_LEGISLATOR_IMAGE_BASE_URL,
			});
		};

		const loadStatePersons = async (): Promise<
			Array<OpenStatesPerson>
		> => {
			// --- State not requested, or no Open States key available → skip. ---
			if (!wantsState) {
				return [];
			}

			// --- Use the warm roster when available; otherwise choose the fast exact-district or broad-chamber lookup. ---
			if (location.state) {
				const hasDistricts = Boolean(
					location.stateHouseDistrict || location.stateSenateDistrict,
				);
				const cachedLegislators = await fetchCachedStateLegislators(
					env,
					location.state,
				);

				if (cachedLegislators) {
					if (hasDistricts) {
						return selectStateRepresentatives({
							people: cachedLegislators,
							location,
						});
					}

					return cachedLegislators;
				}

				if (hasDistricts) {
					return fetchStatePeopleByDistricts(env, location);
				}

				return fetchStatePeopleByQuery(env, { location, searchParams });
			}

			// --- A representative-name query has no resolved state, so it remains the one live Open States search. ---
			return fetchStatePeopleByQuery(env, { location, searchParams });
		};

		const [federalResult, stateResult] = await Promise.allSettled([
			loadFederalRecords(),
			loadStatePersons(),
		]);
		const sourceErrors: Array<string> = [];
		const federalRecords =
			federalResult.status === 'fulfilled' ? federalResult.value : [];
		const statePersons =
			stateResult.status === 'fulfilled' ? stateResult.value : [];

		if (federalResult.status === 'rejected') {
			const cause =
				federalResult.reason instanceof Error
					? federalResult.reason.message
					: String(federalResult.reason);
			sourceErrors.push(`Federal: ${cause}`);
			console.error(cause);
		}

		if (stateResult.status === 'rejected') {
			const cause =
				stateResult.reason instanceof Error
					? stateResult.reason.message
					: String(stateResult.reason);
			sourceErrors.push(`State: ${cause}`);
			console.error(cause);
		}

		// --- Federal records are already normalized; state persons get mapped to records here. ---
		const representatives = [
			...federalRecords,
			...statePersons.map(
				(person: CivicRepresentativeRecord | OpenStatesPerson) =>
					buildStateRecord(person, location),
			),
		];

		if (representatives.length === 0 && sourceErrors.length > 0) {
			const result: CivicRepresentativeActionResult = {
				success: false,
				statusCode: STATUS.INTERNAL_SERVER_ERROR,
				message: 'Representative lookup failed.',
				error: sourceErrors.join(' | '),
				civicRepresentatives: { representatives, location },
			};

			return result;
		}

		// --- Empty → 404 (still echo the resolved location so the UI can show what we matched); else 200. ---
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
						message:
							sourceErrors.length > 0
								? 'Available representatives loaded. Some sources are temporarily unavailable.'
								: 'Representatives loaded.',
						error:
							sourceErrors.length > 0
								? sourceErrors.join(' | ')
								: undefined,
						civicRepresentatives: { representatives, location },
					};

		return result;
	} catch (error: unknown) {
		// --- Any upstream throw (e.g. Open States non-200) lands here as a 500 with the raw cause attached. ---
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
