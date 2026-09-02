// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > INFRASTRUCTURE
// > CIVIC_DATA_PROVIDERS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import type { WorkerEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type {
	CensusRepresentativeLocation,
	CivicRepresentativeRecord,
	CivicRepresentativeSearchParams,
	CivicRepresentativeSearchQueryType,
} from '@representatives-module/domain/representativeModel';
import type {
	CensusGeocoderResponse,
	CongressLegislator,
	OpenStatesPeopleResponse,
	OpenStatesPerson,
} from '@representatives-module/domain/civicUpstreamModel';
import {
	CENSUS_LOCATION_FIELDS,
	OPEN_STATES_INCLUDE,
	US_STATE_CODE_TO_NAME,
	US_STATE_NAME_TO_CODE,
	ZIP_PREFIX_RANGES,
} from '@representatives-module/domain/representativeConstants';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type OpenStatesEnv = Pick<
	WorkerEnv,
	'OPEN_STATES_API_KEY' | 'OPEN_STATES_API_URL'
>;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const cleanUrl = (url: string): string => url.replace(/\/+$/, '');

const jurisdictionId = (code: string): string =>
	`ocd-jurisdiction/country:us/state:${code.toLowerCase()}/government`;

// --- Decide which public source can answer the query (guards, not a match ladder). ---
const classifyQuery = ({
	query,
	queryType,
}: CivicRepresentativeSearchParams): CivicRepresentativeSearchQueryType => {
	const trimmed = query.trim();

	if (queryType && queryType !== 'unknown') {
		return queryType;
	}

	if (/^\d{5}(?:-\d{4})?$/.test(trimmed)) {
		return 'zip';
	}

	if (
		/^[A-Za-z]{2}$/.test(trimmed) ||
		US_STATE_NAME_TO_CODE[trimmed.toLowerCase()]
	) {
		return 'state';
	}

	if (/^\d+\s+/.test(trimmed) || trimmed.includes(',')) {
		return 'address';
	}

	return 'name';
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- ADDRESS (Census geocoder, keyless) ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Census geocode → state + district. Non-geo queries skip the network call. ---
export const fetchAddressLocation = async (
	env: WorkerEnv,
	searchParams: CivicRepresentativeSearchParams,
): Promise<CensusRepresentativeLocation> => {
	const queryType = classifyQuery(searchParams);

	if (
		queryType !== 'address' &&
		queryType !== 'city' &&
		queryType !== 'zip'
	) {
		const normalized = searchParams.query.trim().toLowerCase();
		const result: CensusRepresentativeLocation = {
			state: /^[a-z]{2}$/.test(normalized)
				? normalized.toUpperCase()
				: US_STATE_NAME_TO_CODE[normalized],
		};

		return result;
	}

	if (queryType === 'zip') {
		const prefix = Number(searchParams.query.trim().slice(0, 3));
		const result: CensusRepresentativeLocation = {
			state: ZIP_PREFIX_RANGES.find(
				([min, max]) => prefix >= min && prefix <= max,
			)?.[2],
		};

		return result;
	}

	const response = await ky.get(env.CENSUS_GEOCODER_API_URL, {
		searchParams: {
			address: searchParams.query,
			benchmark: 'Public_AR_Current',
			vintage: 'Current_Current',
			format: 'json',
		},
		throwHttpErrors: false,
	});

	if (response.status !== STATUS.OK) {
		// --- Keyless public source: log the real status but degrade gracefully so federal/state can still answer. ---
		console.error(
			`[Census ${response.status}] ${env.CENSUS_GEOCODER_API_URL}`,
		);

		return {};
	}

	const data = await response.json<CensusGeocoderResponse>();
	const match = data.result?.addressMatches?.[0];
	const location: CensusRepresentativeLocation = {
		matchedAddress: match?.matchedAddress,
		latitude: match?.coordinates?.y,
		longitude: match?.coordinates?.x,
	};

	for (const {
		locationKey,
		geographyNameIncludes,
		valueKeys,
	} of CENSUS_LOCATION_FIELDS) {
		const record = Object.entries(match?.geographies ?? {}).find(
			([name]) =>
				geographyNameIncludes.some((part) =>
					name.toLowerCase().includes(part),
				),
		)?.[1]?.[0];
		const value = valueKeys
			.map((key) => record?.[key])
			.find(
				(entry) => entry !== undefined && `${entry}`.trim().length > 0,
			);
		location[locationKey] = value === undefined ? undefined : `${value}`;
	}

	return location;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- FEDERAL (congress-legislators, keyless) ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Keyless GitHub Pages dataset. One blob, cached weekly upstream. ---
export const fetchFederalLegislators = async (
	env: WorkerEnv,
): Promise<Array<CongressLegislator>> => {
	const response = await ky.get(env.CONGRESS_LEGISLATORS_CURRENT_URL, {
		throwHttpErrors: false,
	});

	if (response.status !== STATUS.OK) {
		// --- Keyless public source: log the real status but degrade gracefully rather than fail the whole lookup. ---
		console.error(
			`[CongressLegislators ${response.status}] ${env.CONGRESS_LEGISLATORS_CURRENT_URL}`,
		);

		return [];
	}

	return response.json<Array<CongressLegislator>>();
};

// --- Raw legislators → matched, normalized records (build + match inlined). ---
export const selectFederalRepresentatives = ({
	legislators,
	location,
	searchParams,
	imageBaseUrl,
}: {
	legislators: Array<CongressLegislator>;
	location: CensusRepresentativeLocation;
	searchParams: CivicRepresentativeSearchParams;
	imageBaseUrl: string;
}): Array<CivicRepresentativeRecord> => {
	const wantsFederal = searchParams.filters.some(
		(filter) =>
			filter === 'federal' || filter === 'house' || filter === 'senate',
	);

	if (!wantsFederal) {
		return [];
	}

	const isNameQuery = classifyQuery(searchParams) === 'name';
	const selectedChambers = searchParams.filters.filter(
		(filter): filter is 'house' | 'senate' =>
			filter === 'house' || filter === 'senate',
	);
	const allowedChambers: Array<string> =
		selectedChambers.length > 0 ? selectedChambers : ['house', 'senate'];

	const result = legislators
		.map((legislator): CivicRepresentativeRecord | undefined => {
			const term = legislator.terms?.at(-1);
			const bioguideId = legislator.id?.bioguide;

			if (!term || !bioguideId || !term.state || !term.type) {
				return undefined;
			}

			const firstName = legislator.name?.first ?? '';
			const lastName = legislator.name?.last ?? '';

			const record: CivicRepresentativeRecord = {
				id: bioguideId,
				source: 'federal',
				bioguideId,
				firstName,
				lastName,
				fullName:
					legislator.name?.official_full ??
					`${firstName} ${lastName}`.trim(),
				party: term.party ?? 'Unknown',
				state: term.state,
				chamber: term.type === 'rep' ? 'house' : 'senate',
				district: term.district?.toString(),
				phone: term.phone,
				office: term.office ?? term.address,
				websiteUrl: term.url,
				contactUrl: term.contact_form,
				photoUrl: `${cleanUrl(imageBaseUrl)}/${bioguideId}.jpg`,
			};

			return record;
		})
		.filter(
			(record): record is CivicRepresentativeRecord =>
				record !== undefined,
		)
		.filter((record) => {
			if (record.chamber !== 'house' && record.chamber !== 'senate') {
				return false;
			}

			if (isNameQuery) {
				return record.fullName
					.toLowerCase()
					.includes(searchParams.query.toLowerCase());
			}

			const locationMatches =
				Boolean(location.state) &&
				record.state === location.state &&
				(record.chamber !== 'house' ||
					location.congressionalDistrict === undefined ||
					record.district === location.congressionalDistrict);

			return allowedChambers.includes(record.chamber) && locationMatches;
		});

	return result;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- STATE (Open States v3, the only keyed source) ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Key injected here from the Worker secret, never in the client. ---
const openStatesGet = async (
	env: OpenStatesEnv,
	endpoint: string,
	params: Record<string, string | Array<string>>,
): Promise<OpenStatesPeopleResponse> => {
	if (!env.OPEN_STATES_API_KEY) {
		const result: OpenStatesPeopleResponse = { results: [] };

		return result;
	}

	// --- Array values repeat the key (include=offices&include=links); a comma value 422s. ---
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (Array.isArray(value)) {
			for (const item of value) {
				searchParams.append(key, item);
			}
		} else {
			searchParams.append(key, value);
		}
	}

	const response = await ky.get(endpoint, {
		headers: { 'x-api-key': env.OPEN_STATES_API_KEY },
		searchParams,
		throwHttpErrors: false,
	});

	if (response.status !== STATUS.OK) {
		// --- Non-200 is a real upstream failure; throw the cause so it rides next to the ST code instead of vanishing into []. ---
		const body = await response.text();

		throw new Error(`Open States ${response.status}: ${body}`);
	}

	const data = await response.json<OpenStatesPeopleResponse>();

	return data;
};

// --- Fetch every Open States page for one jurisdiction; state chambers routinely exceed one 50-person page. ---
const fetchStateRosterPages = async (
	env: OpenStatesEnv,
	endpoint: string,
	jurisdiction: string,
): Promise<Array<OpenStatesPerson>> => {
	const firstResponse = await openStatesGet(env, endpoint, {
		jurisdiction,
		include: OPEN_STATES_INCLUDE,
		page: '1',
		per_page: '50',
	});
	const people = [...(firstResponse.results ?? [])];
	const maxPage = firstResponse.pagination?.max_page ?? 1;
	const remainingPageNumbers = Array.from(
		{ length: Math.max(maxPage - 1, 0) },
		(_, index) => index + 2,
	);
	const remainingResponses = await Promise.all(
		remainingPageNumbers.map((page) =>
			openStatesGet(env, endpoint, {
				jurisdiction,
				include: OPEN_STATES_INCLUDE,
				page: `${page}`,
				per_page: '50',
			}),
		),
	);

	for (const response of remainingResponses) {
		people.push(...(response.results ?? []));
	}

	return people;
};

// --- Full state roster by code. Cacheable per state (cron seeds these). ---
export const fetchStateRosterByCode = async (
	env: OpenStatesEnv,
	code: string,
): Promise<Array<OpenStatesPerson>> => {
	const endpoint = `${cleanUrl(env.OPEN_STATES_API_URL)}/people`;
	const ocdJurisdictionResults = await fetchStateRosterPages(
		env,
		endpoint,
		jurisdictionId(code),
	);

	if (ocdJurisdictionResults.length > 0) {
		return ocdJurisdictionResults;
	}

	// --- Open States REST search can return empty for OCD ids; retry with state name. ---
	const stateName = US_STATE_CODE_TO_NAME[code.toUpperCase()];
	const result = stateName
		? await fetchStateRosterPages(env, endpoint, stateName)
		: [];

	return result;
};

// --- Cold address lookup: request only the two Census-matched districts instead of blocking on a full state roster. ---
export const fetchStatePeopleByDistricts = async (
	env: OpenStatesEnv,
	location: CensusRepresentativeLocation,
): Promise<Array<OpenStatesPerson>> => {
	const endpoint = `${cleanUrl(env.OPEN_STATES_API_URL)}/people`;
	const state = location.state;
	const districtRequests: Array<{
		orgClassification: 'lower' | 'upper';
		district: string;
	}> = [];

	if (location.stateHouseDistrict) {
		districtRequests.push({
			orgClassification: 'lower',
			district: location.stateHouseDistrict.replace(/^0+(?=\d)/, ''),
		});
	}

	if (location.stateSenateDistrict) {
		districtRequests.push({
			orgClassification: 'upper',
			district: location.stateSenateDistrict.replace(/^0+(?=\d)/, ''),
		});
	}

	if (!state || districtRequests.length === 0) {
		return [];
	}

	const responses = await Promise.all(
		districtRequests.map(({ orgClassification, district }) =>
			openStatesGet(env, endpoint, {
				jurisdiction: jurisdictionId(state),
				org_classification: orgClassification,
				district,
				include: OPEN_STATES_INCLUDE,
				per_page: '5',
			}),
		),
	);
	const result = responses.flatMap((response) => response.results ?? []);

	return result;
};

// --- Address-specific (geo) or name lookups. Live, not cached. ---
export const fetchStatePeopleByQuery = async (
	env: OpenStatesEnv,
	{
		location,
		searchParams,
	}: {
		location: CensusRepresentativeLocation;
		searchParams: CivicRepresentativeSearchParams;
	},
): Promise<Array<OpenStatesPerson>> => {
	const base = cleanUrl(env.OPEN_STATES_API_URL);
	const isNameQuery = classifyQuery(searchParams) === 'name';

	if (
		location.latitude !== undefined &&
		location.longitude !== undefined
	) {
		const response = await openStatesGet(env, `${base}/people.geo`, {
			lat: `${location.latitude}`,
			lng: `${location.longitude}`,
			include: OPEN_STATES_INCLUDE,
		});
		const result = response.results ?? [];

		return result;
	}

	// --- Broad state/ZIP lookup: guarantee a fast page from each legislative chamber without requiring an address. ---
	if (location.state && !isNameQuery) {
		const chamberClassifications: Array<'lower' | 'upper'> = [
			'lower',
			'upper',
		];
		const responses = await Promise.all(
			chamberClassifications.map((orgClassification) =>
				openStatesGet(env, `${base}/people`, {
					jurisdiction: jurisdictionId(location.state ?? ''),
					org_classification: orgClassification,
					include: OPEN_STATES_INCLUDE,
					per_page: '50',
				}),
			),
		);
		const result = responses.flatMap((response) => response.results ?? []);

		return result;
	}

	const response = await openStatesGet(env, `${base}/people`, {
		...(isNameQuery ? { name: searchParams.query } : {}),
		...(location.state
			? { jurisdiction: jurisdictionId(location.state) }
			: {}),
		include: OPEN_STATES_INCLUDE,
		per_page: '20',
	});
	const result = response.results ?? [];

	return result;
};

// --- Census gives district numbers; match those against the complete state roster already stored in KV. ---
export const selectStateRepresentatives = ({
	people,
	location,
}: {
	people: Array<OpenStatesPerson>;
	location: CensusRepresentativeLocation;
}): Array<OpenStatesPerson> => {
	const normalizedHouseDistrict = location.stateHouseDistrict?.replace(
		/^0+(?=\d)/,
		'',
	);
	const normalizedSenateDistrict = location.stateSenateDistrict?.replace(
		/^0+(?=\d)/,
		'',
	);
	const result = people.filter((person) => {
		const chamber = person.current_role?.org_classification;
		const district = person.current_role?.district?.replace(
			/^0+(?=\d)/,
			'',
		);

		if (!district) {
			return false;
		}

		if (chamber === 'lower') {
			return district === normalizedHouseDistrict;
		}

		if (chamber === 'upper') {
			return district === normalizedSenateDistrict;
		}

		return false;
	});

	return result;
};

// --- Open States person → record. Photo may be absent (frontend swaps a placeholder). ---
export const buildStateRecord = (
	person: OpenStatesPerson,
	location: CensusRepresentativeLocation,
): CivicRepresentativeRecord => {
	const office = person.offices?.[0];
	const link = person.links?.[0];

	return {
		id: person.id ?? person.name ?? crypto.randomUUID(),
		source: 'state',
		fullName: person.name ?? 'Unknown representative',
		party: person.party ?? 'Unknown',
		state: location.state ?? person.jurisdiction?.name ?? 'Unknown',
		chamber:
			person.current_role?.org_classification ??
			person.current_role?.title ??
			'state-legislature',
		district: person.current_role?.district,
		phone: office?.voice,
		office: office?.name ?? office?.address,
		websiteUrl: link?.url ?? person.openstates_url,
		photoUrl: person.image,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
