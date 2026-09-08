// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: MODELS > TARIFF_ACTIVITY_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Matches the Worker contract. Values remain actual USD; only the chart adapter decides how to display them. ---
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
