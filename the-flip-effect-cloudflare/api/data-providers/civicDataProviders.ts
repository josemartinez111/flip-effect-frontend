// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: API > DATA_PROVIDERS
// > CIVIC_DATA_PROVIDERS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import type { WorkerEnv } from '../worker-env';
import type {
	CensusGeocoderResponse,
	CensusRepresentativeLocation,
	CivicRepresentativeRecord,
	CivicRepresentativeSearchParams,
	CivicRepresentativeSearchQueryType,
	CongressLegislator,
	OpenStatesPeopleResponse,
	OpenStatesPerson,
} from '../shared';
import {
	CENSUS_LOCATION_FIELDS,
	OPEN_STATES_INCLUDE,
	STATUS,
	US_STATE_CODE_TO_NAME,
	US_STATE_NAME_TO_CODE,
	ZIP_PREFIX_RANGES,
} from '../shared';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const cleanUrl = (url: string): string => (
	url.replace(/\/+$/, '')
);

const jurisdictionId = (code: string): string => (
	`ocd-jurisdiction/country:us/state:${code.toLowerCase()}/government`
);

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

	if (/^[A-Za-z]{2}$/.test(trimmed) || US_STATE_NAME_TO_CODE[trimmed.toLowerCase()]) {
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

	if (queryType !== 'address' && queryType !== 'city' && queryType !== 'zip') {
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
			state: ZIP_PREFIX_RANGES.find(([min, max]) => prefix >= min && prefix <= max)?.[2],
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
		console.error(`[Census ${response.status}] ${env.CENSUS_GEOCODER_API_URL}`);

		return {};
	}

	const data = await response.json<CensusGeocoderResponse>();
	const match = data.result?.addressMatches?.[0];
	const location: CensusRepresentativeLocation = {
		matchedAddress: match?.matchedAddress,
		latitude: match?.coordinates?.y,
		longitude: match?.coordinates?.x,
	};

	for (const { locationKey, geographyNameIncludes, valueKeys } of CENSUS_LOCATION_FIELDS) {
		const record = Object.entries(match?.geographies ?? {}).find(([name]) =>
			geographyNameIncludes.some((part) => name.toLowerCase().includes(part)),
		)?.[1]?.[0];
		const value = valueKeys
			.map((key) => record?.[key])
			.find((entry) => entry !== undefined && `${entry}`.trim().length > 0);
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
		console.error(`[CongressLegislators ${response.status}] ${env.CONGRESS_LEGISLATORS_CURRENT_URL}`);

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
		(filter) => filter === 'federal' || filter === 'house' || filter === 'senate',
	);

	if (!wantsFederal) {
		return [];
	}

	const isNameQuery = classifyQuery(searchParams) === 'name';
	const selectedChambers = searchParams.filters.filter(
		(filter): filter is 'house' | 'senate' => filter === 'house' || filter === 'senate',
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
		.filter((record): record is CivicRepresentativeRecord => record !== undefined)
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
	env: WorkerEnv,
	endpoint: string,
	params: Record<string, string | Array<string>>,
): Promise<Array<OpenStatesPerson>> => {
	if (!env.OPEN_STATES_API_KEY) {
		return [];
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
	return data.results ?? [];
};

// --- Full state roster by code. Cacheable per state (cron seeds these). ---
export const fetchStateRosterByCode = async (
	env: WorkerEnv,
	code: string,
): Promise<Array<OpenStatesPerson>> => {
	const endpoint = `${cleanUrl(env.OPEN_STATES_API_URL)}/people`;
	const ocdJurisdictionResults = await openStatesGet(env, endpoint, {
		jurisdiction: jurisdictionId(code),
		include: OPEN_STATES_INCLUDE,
		per_page: '50',
	});

	if (ocdJurisdictionResults.length > 0) {
		return ocdJurisdictionResults;
	}

	// --- Open States REST search can return empty for OCD ids; retry with state name. ---
	const stateName = US_STATE_CODE_TO_NAME[code.toUpperCase()];
	const result = stateName
		? await openStatesGet(env, endpoint, {
				jurisdiction: stateName,
				include: OPEN_STATES_INCLUDE,
				per_page: '50',
			})
		: [];

	return result;
};

// --- Address-specific (geo) or name lookups. Live, not cached. ---
export const fetchStatePeopleByQuery = (
	env: WorkerEnv,
	{
		location,
		searchParams,
	}: {
		location: CensusRepresentativeLocation;
		searchParams: CivicRepresentativeSearchParams;
	},
): Promise<Array<OpenStatesPerson>> => {
	const base = cleanUrl(env.OPEN_STATES_API_URL);

	if (location.latitude !== undefined && location.longitude !== undefined) {
		return openStatesGet(env, `${base}/people.geo`, {
			lat: `${location.latitude}`,
			lng: `${location.longitude}`,
			include: OPEN_STATES_INCLUDE,
		});
	}

	return openStatesGet(env, `${base}/people`, {
		...(classifyQuery(searchParams) === 'name' ? { name: searchParams.query } : {}),
		...(location.state ? { jurisdiction: jurisdictionId(location.state) } : {}),
		include: OPEN_STATES_INCLUDE,
		per_page: '20',
	});
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
