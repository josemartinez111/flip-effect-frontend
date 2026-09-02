// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > DOMAIN
// > CIVIC_UPSTREAM_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Raw upstream shapes (congress-legislators / census / open states). External DTOs;
// providers map these into the domain model.
// ---

// --- Congress legislators (keyless GitHub Pages dataset) ---
type CongressLegislatorTerm = {
	type?: 'rep' | 'sen';
	state?: string;
	district?: number;
	party?: string;
	phone?: string;
	office?: string;
	address?: string;
	url?: string;
	contact_form?: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressLegislator = {
	id?: { bioguide?: string };
	name?: { first?: string; last?: string; official_full?: string };
	terms?: Array<CongressLegislatorTerm>;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Census geocoder ---
type CensusGeographyRecord = Record<string, string | number | undefined>;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type CensusAddressMatch = {
	matchedAddress?: string;
	coordinates?: { x?: number; y?: number };
	geographies?: Record<string, Array<CensusGeographyRecord>>;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CensusGeocoderResponse = {
	result?: { addressMatches?: Array<CensusAddressMatch> };
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Open States v3 ---
export type OpenStatesPerson = {
	id?: string;
	name?: string;
	party?: string;
	image?: string;
	openstates_url?: string;
	links?: Array<{ url?: string }>;
	current_role?: {
		title?: string;
		org_classification?: string;
		district?: string;
	};
	jurisdiction?: { name?: string };
	offices?: Array<{ name?: string; voice?: string; address?: string }>;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type OpenStatesPeopleResponse = {
	pagination?: {
		per_page?: number;
		page?: number;
		max_page?: number;
		total_items?: number;
	};
	results?: Array<OpenStatesPerson>;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
