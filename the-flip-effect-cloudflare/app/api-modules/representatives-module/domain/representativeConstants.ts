// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > DOMAIN
// > REPRESENTATIVE_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Cache keys + lookup constants ---
export const CACHE_TTL_SECONDS = 604800; // --- one week ---
export const FEDERAL_LEGISLATORS_KEY = 'federal:legislators';
// --- List param: Open States needs repeated `include=` keys, never a comma-joined value (422). ---
export const OPEN_STATES_INCLUDE: Array<string> = ['offices', 'links'];
export const stateCacheKey = (code: string): string => `state:${code.toUpperCase()}`;

// --- State name → USPS code (also drives the weekly cron roster loop) ---
export const US_STATE_NAME_TO_CODE: Record<string, string> = {
	alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
	colorado: 'CO', connecticut: 'CT', delaware: 'DE', 'district of columbia': 'DC',
	florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID', illinois: 'IL',
	indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA',
	maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
	mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
	'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
	'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK',
	oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
	'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
	virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
};

export const US_STATE_CODES = Object.values(US_STATE_NAME_TO_CODE);

export const US_STATE_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
	Object.entries(US_STATE_NAME_TO_CODE).map(([stateName, stateCode]) => [
		stateCode,
		stateName,
	]),
);

// --- ZIP3 prefix → USPS state (SCF ranges). Resolves bare-ZIP lookups without geocoding. ---
export const ZIP_PREFIX_RANGES: Array<[number, number, string]> = [
	[5, 5, 'NY'], [10, 27, 'MA'], [28, 29, 'RI'], [30, 38, 'NH'], [39, 49, 'ME'],
	[50, 59, 'VT'], [60, 69, 'CT'], [70, 89, 'NJ'], [100, 149, 'NY'], [150, 196, 'PA'],
	[197, 199, 'DE'], [200, 205, 'DC'], [206, 219, 'MD'], [220, 246, 'VA'], [247, 268, 'WV'],
	[270, 289, 'NC'], [290, 299, 'SC'], [300, 319, 'GA'], [320, 349, 'FL'], [350, 369, 'AL'],
	[370, 385, 'TN'], [386, 397, 'MS'], [398, 399, 'GA'], [400, 427, 'KY'], [430, 459, 'OH'],
	[460, 479, 'IN'], [480, 499, 'MI'], [500, 528, 'IA'], [530, 549, 'WI'], [550, 567, 'MN'],
	[570, 577, 'SD'], [580, 588, 'ND'], [590, 599, 'MT'], [600, 629, 'IL'], [630, 658, 'MO'],
	[660, 679, 'KS'], [680, 693, 'NE'], [700, 714, 'LA'], [716, 729, 'AR'], [730, 749, 'OK'],
	[750, 799, 'TX'], [800, 816, 'CO'], [820, 831, 'WY'], [832, 838, 'ID'], [840, 847, 'UT'],
	[850, 865, 'AZ'], [870, 884, 'NM'], [889, 898, 'NV'], [900, 961, 'CA'], [967, 968, 'HI'],
	[970, 979, 'OR'], [980, 994, 'WA'], [995, 999, 'AK'],
];

// --- Census geography fields we lift out of a geocoder match (type pairs with the constant below) ---
export type CensusLocationField = {
	locationKey: 'state' | 'congressionalDistrict' | 'stateHouseDistrict' | 'stateSenateDistrict';
	geographyNameIncludes: Array<string>;
	valueKeys: Array<string>;
};

export const CENSUS_LOCATION_FIELDS: Array<CensusLocationField> = [
	{ locationKey: 'state', geographyNameIncludes: ['states'], valueKeys: ['STUSAB', 'NAME'] },
	{ locationKey: 'congressionalDistrict', geographyNameIncludes: ['congressional districts'], valueKeys: ['BASENAME', 'CD119', 'CD118', 'GEOID'] },
	{ locationKey: 'stateHouseDistrict', geographyNameIncludes: ['state legislative districts - lower'], valueKeys: ['BASENAME', 'SLDLST', 'GEOID'] },
	{ locationKey: 'stateSenateDistrict', geographyNameIncludes: ['state legislative districts - upper'], valueKeys: ['BASENAME', 'SLDUST', 'GEOID'] },
];
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
