// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > CONGRESSIONAL-BALANCE-MODULE > DOMAIN
// > CONGRESSIONAL_BALANCE_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from '@shared-module/httpStatus';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CongressionalChamber = 'house' | 'senate';

// --- Party counts stay separate from caucus counts so independent seats render honestly without breaking control math. ---
export type CongressionalChamberBalance = {
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

// --- Compact KV and wire contract derived from the much larger federal roster. ---
export type CongressionalBalance = {
	house: CongressionalChamberBalance;
	senate: CongressionalChamberBalance;
	source: string;
	sourceUrl: string;
	fetchedAt: string;
};

// --- The endpoint returns one status-safe branch: balance data on success or an error on failure. ---
export type CongressionalBalanceActionResult =
	| {
			success: true;
			statusCode: SuccessHttpStatus;
			message: string;
			congressionalBalance: CongressionalBalance;
			error?: never;
	  }
	| {
			success: false;
			statusCode: FailureHttpStatus;
			message: string;
			error: string;
			congressionalBalance?: never;
	  };
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
