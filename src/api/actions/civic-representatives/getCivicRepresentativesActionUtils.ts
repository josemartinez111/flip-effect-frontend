// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > CIVIC_REPRESENTATIVES
// > GET_CIVIC_REPRESENTATIVES_ACTION_UTILS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import kyMap from 'ky';
import { GlobalEnvs, ST } from '../../../lib';
import type {
	CensusRepresentativeLocation,
	CivicRepresentativeRecord,
	CivicRepresentativeSearchParams,
} from '../../models/CivicRepresentativeModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type CongressLegislatorTerm = { type?: 'rep' | 'sen'; state?: string; district?: number; party?: string; phone?: string; office?: string; address?: string; url?: string; contact_form?: string };
type CongressLegislator = { id?: { bioguide?: string }; name?: { first?: string; last?: string; official_full?: string }; terms?: Array<CongressLegislatorTerm> };
type CensusGeographyRecord = Record<string, string | number | undefined>;
type CensusAddressMatch = { matchedAddress?: string; coordinates?: { x?: number; y?: number }; geographies?: Record<string, Array<CensusGeographyRecord>> };
type CensusGeocoderResponse = { result?: { addressMatches?: Array<CensusAddressMatch> } };
type OpenStatesPerson = { id?: string; name?: string; party?: string; image?: string; openstates_url?: string; links?: Array<{ url?: string }>; current_role?: { title?: string; org_classification?: string; district?: string }; jurisdiction?: { name?: string }; offices?: Array<{ name?: string; voice?: string; address?: string }> };
type OpenStatesPeopleResponse = { results?: Array<OpenStatesPerson> };

const OPEN_STATES_API_KEY_PLACEHOLDER = 'replace_with_open_states_api_key';
const STATE_PAIRS = 'alabama:AL|alaska:AK|arizona:AZ|arkansas:AR|california:CA|colorado:CO|connecticut:CT|delaware:DE|district of columbia:DC|florida:FL|georgia:GA|hawaii:HI|idaho:ID|illinois:IL|indiana:IN|iowa:IA|kansas:KS|kentucky:KY|louisiana:LA|maine:ME|maryland:MD|massachusetts:MA|michigan:MI|minnesota:MN|mississippi:MS|missouri:MO|montana:MT|nebraska:NE|nevada:NV|new hampshire:NH|new jersey:NJ|new mexico:NM|new york:NY|north carolina:NC|north dakota:ND|ohio:OH|oklahoma:OK|oregon:OR|pennsylvania:PA|rhode island:RI|south carolina:SC|south dakota:SD|tennessee:TN|texas:TX|utah:UT|vermont:VT|virginia:VA|washington:WA|west virginia:WV|wisconsin:WI|wyoming:WY';
const STATE_NAME_TO_CODE = Object.fromEntries(
	STATE_PAIRS.split('|').map((statePair) => {
		const [stateName, stateCode] = statePair.split(':');
		return [stateName, stateCode];
	}),
) as Record<string, string>;

const getCleanUrl = (url: string) => {
	return url.replace(/\/+$/, '');
};

const getQueryType = ({
	query,
	queryType,
}: CivicRepresentativeSearchParams) => {
	if (queryType && queryType !== 'unknown') {
		return queryType;
	}

	const trimmedQuery = query.trim();

	if (/^\d{5}(?:-\d{4})?$/.test(trimmedQuery)) {
		return 'zip';
	}

	if (/^[A-Za-z]{2}$/.test(trimmedQuery) || STATE_NAME_TO_CODE[trimmedQuery.toLowerCase()]) {
		return 'state';
	}

	if (/^\d+\s+/.test(trimmedQuery) || trimmedQuery.includes(',')) {
		return 'address';
	}

	return 'name';
};

const getStateCodeFromQuery = (query: string) => {
	const normalizedQuery = query.trim().toLowerCase();

	if (/^[a-z]{2}$/.test(normalizedQuery)) {
		return normalizedQuery.toUpperCase();
	}

	return STATE_NAME_TO_CODE[normalizedQuery];
};

const getFirstGeographyRecord = (
	geographies: CensusAddressMatch['geographies'],
	geographyNameIncludes: Array<string>,
) => {
	if (!geographies) {
		return;
	}

	const geographyEntry = Object.entries(geographies).find(([geographyName]) => {
		const normalizedGeographyName = geographyName.toLowerCase();

		return geographyNameIncludes.some((namePart) => {
			return normalizedGeographyName.includes(namePart);
		});
	});

	return geographyEntry?.[1]?.[0];
};

const getGeographyValue = (
	geographyRecord: CensusGeographyRecord | undefined,
	keys: Array<string>,
) => {
	if (!geographyRecord) {
		return;
	}

	const value = keys
		.map((key) => {
			return geographyRecord[key];
		})
		.find((recordValue) => {
			return recordValue !== undefined && `${recordValue}`.trim().length > 0;
		});

	return value === undefined ? undefined : `${value}`;
};

export const getCensusRepresentativeLocation = async (
	searchParams: CivicRepresentativeSearchParams,
) => {
	const queryType = getQueryType(searchParams);

	if (!['address', 'city', 'zip'].includes(queryType)) {
		return {
			state: getStateCodeFromQuery(searchParams.query),
		} satisfies CensusRepresentativeLocation;
	}

	const response = await kyMap.get(GlobalEnvs.CensusGeocoderApiUrl, {
		searchParams: {
			address: searchParams.query,
			benchmark: 'Public_AR_Current',
			vintage: 'Current_Current',
			format: 'json',
		},
		throwHttpErrors: false,
	});

	if (response.status !== ST.OK) {
		return {};
	}

	const geocoderResponse = await response.json<CensusGeocoderResponse>();
	const addressMatch = geocoderResponse.result?.addressMatches?.[0];
	const stateGeography = getFirstGeographyRecord(
		addressMatch?.geographies,
		['states'],
	);
	const congressionalGeography = getFirstGeographyRecord(
		addressMatch?.geographies,
		['congressional districts'],
	);
	const stateHouseGeography = getFirstGeographyRecord(
		addressMatch?.geographies,
		['state legislative districts - lower'],
	);
	const stateSenateGeography = getFirstGeographyRecord(
		addressMatch?.geographies,
		['state legislative districts - upper'],
	);

	return {
		matchedAddress: addressMatch?.matchedAddress,
		state: getGeographyValue(stateGeography, ['STUSAB', 'NAME']),
		congressionalDistrict: getGeographyValue(congressionalGeography, [
			'BASENAME',
			'CD119',
			'CD118',
			'GEOID',
		]),
		stateHouseDistrict: getGeographyValue(stateHouseGeography, [
			'BASENAME',
			'SLDLST',
			'GEOID',
		]),
		stateSenateDistrict: getGeographyValue(stateSenateGeography, [
			'BASENAME',
			'SLDUST',
			'GEOID',
		]),
		latitude: addressMatch?.coordinates?.y,
		longitude: addressMatch?.coordinates?.x,
	} satisfies CensusRepresentativeLocation;
};

const getLatestCongressTerm = (legislator: CongressLegislator) => {
	if (!legislator.terms || legislator.terms.length === 0) {
		return;
	}

	return legislator.terms[legislator.terms.length - 1];
};

const getFederalRepresentativeChambers = (
	filters: CivicRepresentativeSearchParams['filters'],
) => {
	const chamberFilters = filters.filter((filter) => {
		return filter === 'house' || filter === 'senate';
	});

	return chamberFilters.length > 0 ? chamberFilters : ['house', 'senate'];
};

const getFederalRepresentativeMatches = ({
	representative,
	location,
	searchParams,
}: {
	representative: CivicRepresentativeRecord;
	location: CensusRepresentativeLocation;
	searchParams: CivicRepresentativeSearchParams;
}) => {
	const queryType = getQueryType(searchParams);
	const normalizedQuery = searchParams.query.toLowerCase();
	const allowedChambers = getFederalRepresentativeChambers(
		searchParams.filters,
	);

	if (!allowedChambers.includes(representative.chamber)) {
		return false;
	}

	if (queryType === 'name') {
		return representative.fullName.toLowerCase().includes(normalizedQuery);
	}

	if (location.state && representative.state !== location.state) {
		return false;
	}

	if (
		representative.chamber === 'house' &&
		location.congressionalDistrict &&
		representative.district !== location.congressionalDistrict
	) {
		return false;
	}

	return Boolean(location.state);
};

export const getFederalRepresentatives = async ({
	location,
	searchParams,
}: {
	location: CensusRepresentativeLocation;
	searchParams: CivicRepresentativeSearchParams;
}) => {
	if (
		!searchParams.filters.includes('federal') &&
		!searchParams.filters.includes('house') &&
		!searchParams.filters.includes('senate')
	) {
		return [];
	}

	const response = await kyMap.get(GlobalEnvs.CongressLegislatorsCurrentUrl, {
		throwHttpErrors: false,
	});

	if (response.status !== ST.OK) {
		return [];
	}

	const legislators = await response.json<Array<CongressLegislator>>();

	return legislators
		.map((legislator): CivicRepresentativeRecord | undefined => {
			const latestTerm = getLatestCongressTerm(legislator);
			const bioguideId = legislator.id?.bioguide;

			if (!latestTerm || !bioguideId || !latestTerm.state || !latestTerm.type) {
				return;
			}

			return {
				id: bioguideId,
				source: 'federal',
				bioguideId,
				firstName: legislator.name?.first ?? '',
				lastName: legislator.name?.last ?? '',
				fullName:
					legislator.name?.official_full ??
					`${legislator.name?.first ?? ''} ${legislator.name?.last ?? ''}`.trim(),
				party: latestTerm.party ?? 'Unknown',
				state: latestTerm.state,
				chamber: latestTerm.type === 'rep' ? 'house' : 'senate',
				district: latestTerm.district?.toString(),
				phone: latestTerm.phone,
				office: latestTerm.office ?? latestTerm.address,
				websiteUrl: latestTerm.url,
				contactUrl: latestTerm.contact_form,
				photoUrl: `${getCleanUrl(GlobalEnvs.CongressLegislatorImageBaseUrl)}/${bioguideId}.jpg`,
			};
		})
		.filter((representative): representative is CivicRepresentativeRecord => {
			return Boolean(representative);
		})
		.filter((representative) => {
			return getFederalRepresentativeMatches({
				representative,
				location,
				searchParams,
			});
		});
};

export const getOpenStatesApiReady = () => {
	return (
		GlobalEnvs.OpenStatesApiKey.trim().length > 0 &&
		GlobalEnvs.OpenStatesApiKey !== OPEN_STATES_API_KEY_PLACEHOLDER
	);
};

export const getOpenStatesRepresentatives = async ({
	location,
	searchParams,
}: {
	location: CensusRepresentativeLocation;
	searchParams: CivicRepresentativeSearchParams;
}) => {
	if (!searchParams.filters.includes('state')) {
		return [];
	}

	const openStatesApiUrl = getCleanUrl(GlobalEnvs.OpenStatesApiUrl);
	const queryType = getQueryType(searchParams);
	const geoLookup =
		location.latitude !== undefined && location.longitude !== undefined;
	const endpoint = geoLookup
		? `${openStatesApiUrl}/people.geo`
		: `${openStatesApiUrl}/people`;
	const searchParamsValue = geoLookup
		? {
				lat: `${location.latitude}`,
				lng: `${location.longitude}`,
				include: 'offices,links',
			}
		: {
				...(queryType === 'name' ? { name: searchParams.query } : {}),
				...(location.state
					? {
							jurisdiction: `ocd-jurisdiction/country:us/state:${location.state.toLowerCase()}/government`,
						}
					: {}),
				include: 'offices,links',
				per_page: '20',
			};

	const response = await kyMap.get(endpoint, {
		headers: {
			'x-api-key': GlobalEnvs.OpenStatesApiKey,
		},
		searchParams: searchParamsValue,
		throwHttpErrors: false,
	});

	if (response.status !== ST.OK) {
		return [];
	}

	const peopleResponse = await response.json<OpenStatesPeopleResponse>();

	return (peopleResponse.results ?? []).map((person): CivicRepresentativeRecord => {
		const firstOffice = person.offices?.[0];
		const firstLink = person.links?.[0];

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
			phone: firstOffice?.voice,
			office: firstOffice?.name ?? firstOffice?.address,
			websiteUrl: firstLink?.url ?? person.openstates_url,
			photoUrl: person.image,
		};
	});
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
