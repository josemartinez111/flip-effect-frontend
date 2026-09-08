// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > DOMAIN > HOUSEHOLD_PRICE_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from '@shared-module/httpStatus';

// --- Published price indices, not household dollar costs or estimates of tariff causation. ---
export type HouseholdPriceObservation = {
	date: string;
	lowerPricedIndex: number;
	premiumIndex: number;
};

export type HouseholdPrices = {
	observations: Array<HouseholdPriceObservation>;
	baselineDate: string;
	latestObservationDate: string;
	fetchedAt: string;
	source: string;
	sourceUrl: string;
	dataUrl: string;
};

export type HouseholdPriceActionResult =
	| {
			success: true;
			statusCode: SuccessHttpStatus;
			message: string;
			householdPrices: HouseholdPrices;
			isStale: boolean;
			error?: never;
	  }
	| {
			success: false;
			statusCode: FailureHttpStatus;
			message: string;
			error: string;
			householdPrices?: never;
			isStale?: never;
	  };

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
