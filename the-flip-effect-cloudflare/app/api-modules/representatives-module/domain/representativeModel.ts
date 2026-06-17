// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > DOMAIN
// > REPRESENTATIVE_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { HttpStatus } from '@shared-module/httpStatus';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Search input (must match the frontend CivicRepresentative search model) ---
export type CivicRepresentativeSource = 'federal' | 'state';
export type CivicRepresentativeSearchFilter = 'federal' | 'house' | 'senate' | 'state';
export type CivicRepresentativeSearchQueryType = 'address' | 'city' | 'name' | 'state' | 'zip' | 'unknown';

export type CivicRepresentativeSearchParams = {
	query: string;
	filters: Array<CivicRepresentativeSearchFilter>;
	queryType?: CivicRepresentativeSearchQueryType;
};

// --- Normalized records + location (the shape the frontend renders) ---
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

export type CivicRepresentative = {
	representatives: Array<CivicRepresentativeRecord>;
	location?: CensusRepresentativeLocation;
};

// --- Action result envelope returned by the service / endpoint ---
export type CivicRepresentativeActionResult = {
	success: boolean;
	statusCode: HttpStatus;
	message: string;
	// --- Friendly `message` is the action outcome; `error` carries the raw upstream cause, side by side. ---
	error?: string;
	civicRepresentatives?: CivicRepresentative;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
