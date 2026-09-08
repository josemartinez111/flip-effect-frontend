// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API > ACTION-RESULTS > HOUSEHOLD_PRICE_ACTION_RESULT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { HouseholdPrices } from '../models/HouseholdPriceModel';
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from '../../lib/types/HttpStatusTypes';

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

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
