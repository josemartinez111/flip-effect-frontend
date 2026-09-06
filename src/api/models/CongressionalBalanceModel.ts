// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: MODELS
// > CONGRESSIONAL_BALANCE_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressionalChamber = 'house' | 'senate';

// --- Party counts render individual seats; caucus counts determine control and comparison bars. ---
export type CongressChamberBalance = {
	chamber: CongressionalChamber;
	totalSeats: number;
	filledSeats: number;
	democrats: number;
	republicans: number;
	independents: number;
	democraticCaucus: number;
	republicanCaucus: number;
	vacancies: number;
};

// --- Compact Worker response; the full federal roster never crosses into the browser. ---
export type CongressBalance = {
	house: CongressChamberBalance;
	senate: CongressChamberBalance;
	source: string;
	sourceUrl: string;
	fetchedAt: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
