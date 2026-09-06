// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTION_RESULTS
// > CONGRESSIONAL_BALANCE_ACTION_RESULT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { CongressBalance } from '../models/CongressionalBalanceModel.ts';
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from '../../lib/types/HttpStatusTypes.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Discriminated result keeps success data and failure details impossible to mix. ---
export type CongressBalanceActionResult =
	| {
			success: true;
			statusCode: SuccessHttpStatus;
			message: string;
			congressionalBalance: CongressBalance;
			error?: never;
	  }
	| {
			success: false;
			statusCode: FailureHttpStatus;
			message: string;
			error: string;
			congressionalBalance?: never;
	  };
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
