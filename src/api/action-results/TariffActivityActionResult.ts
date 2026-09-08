// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTION-RESULTS > TARIFF_ACTIVITY_ACTION_RESULT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { TariffActivity } from '../models/TariffActivityModel';
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from '../../lib/types/HttpStatusTypes';

export type TariffActivityActionResult =
	| {
			success: true;
			statusCode: SuccessHttpStatus;
			message: string;
			tariffActivity: TariffActivity;
			isStale: boolean;
			error?: never;
	  }
	| {
			success: false;
			statusCode: FailureHttpStatus;
			message: string;
			error: string;
			tariffActivity?: never;
			isStale?: never;
	  };
