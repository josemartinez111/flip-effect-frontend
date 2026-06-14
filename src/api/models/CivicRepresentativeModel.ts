// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: MODELS > CIVIC_REPRESENTATIVE_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CivicRepresentativeSearchFilter =
	| 'federal'
	| 'house'
	| 'senate'
	| 'state';

export type CivicRepresentativeSource =
	| 'federal'
	| 'state';

export type CivicRepresentativeSearchQueryType =
	| 'address'
	| 'city'
	| 'name'
	| 'state'
	| 'zip'
	| 'unknown';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CivicRepresentativeSearchParams = {
	query: string;
	filters: Array<CivicRepresentativeSearchFilter>;
	queryType?: CivicRepresentativeSearchQueryType;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CivicRepresentativeRecord = {
	id: string;
	source: CivicRepresentativeSource;
	fullName: string;
	party: string;
	state: string;
	chamber: string;
	bioguideId?: string;
	firstName?: string;
	lastName?: string;
	district?: string;
	phone?: string;
	office?: string;
	websiteUrl?: string;
	contactUrl?: string;
	photoUrl?: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CensusRepresentativeLocation = {
	matchedAddress?: string;
	state?: string;
	city?: string;
	zip?: string;
	congressionalDistrict?: string;
	stateHouseDistrict?: string;
	stateSenateDistrict?: string;
	latitude?: number;
	longitude?: number;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Main frontend model that groups the three representative data sources. ---
export type CivicRepresentative = {
	representatives: Array<CivicRepresentativeRecord>;
	location?: CensusRepresentativeLocation;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
