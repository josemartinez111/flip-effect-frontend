// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > DOMAIN > TARIFF_ACTIVITY_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from '@shared-module/httpStatus';

// --- Treasury amounts are actual USD, not millions. Refunds are distinct from separately funded relief awards. ---
export type TariffMonth = {
	reportDate: string;
	collected: number;
	refunded: number;
	netReceipts: number;
};

export type TariffActivity = {
	months: Array<TariffMonth>;
	latestReportDate: string;
	fetchedAt: string;
	source: string;
	sourceUrl: string;
	currency: 'USD';
};

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
