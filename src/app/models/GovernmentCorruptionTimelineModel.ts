// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// APP: MODELS
// > GOVERNMENT_CORRUPTION_TIMELINE_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type GovernmentCorruptionTimelineImageKey =
	| 'civil-servants-fired'
	| 'courts-attacked'
	| 'doge-data-access'
	| 'doj-settlement-request'
	| 'epstein-files-crisis'
	| 'executive-order-14215'
	| 'funds-withheld'
	| 'hundredth-state-lawsuit'
	| 'ice-custody-deaths'
	| 'ice-farm-raid'
	| 'ice-profiling-order'
	| 'ice-shooting-case'
	| 'ice-warrantless-entry-memo'
	| 'immigration-detention-rulings'
	| 'inauguration-day'
	| 'inspector-general-firing'
	| 'kennedy-center-name-removal'
	| 'kushner-shadow-diplomacy'
	| 'lawsuits-against-the-administration'
	| 'lobstergate-begins'
	| 'lobstergate-peaks'
	| 'noem-dhs-ad-spending-scandal'
	| 'ny-officials-detained'
	| 'research-grants-blocked'
	| 'secretary-fired'
	| 'student-visas-revoked'
	| 'trump-family-profits'
	| 'trump-power-purge'
	| 'tulsi-gabbard-beginning-end'
	| 'usaid-purge'
	| 'usaid-shutdown'
	| 'us-israel-iran-war'
	| 'whistleblower-memo-exposed';

type GovernmentCorruptionTimelineBranch =
	| 'Congress'
	| 'Elections'
	| 'Executive'
	| 'Judicial'
	| 'State And Local';

type GovernmentCorruptionTimelineCategory =
	| 'Agency Dismantling'
	| 'Agency Power'
	| 'Budget Power'
	| 'Cabinet Turnover'
	| 'Checks And Balances'
	| 'Civil Service'
	| 'Data Access'
	| 'Detention'
	| 'Due Process'
	| 'Executive Power'
	| 'Federal Spending'
	| 'Foreign Policy'
	| 'Fourth Amendment'
	| 'Immigration'
	| 'Immigration Enforcement'
	| 'Independent Agencies'
	| 'Intelligence'
	| 'Justice Department'
	| 'Legal Resistance'
	| 'Oversight'
	| 'Party Control'
	| 'Personal Enrichment'
	| 'Public Institutions'
	| 'Research Funding'
	| 'War Powers'
	| 'Whistleblowers';

type GovernmentCorruptionTimelineSeverity =
	| 'medium'
	| 'high'
	| 'critical';

export type GovernmentCorruptionTimelineEvent<
	TImageKey extends GovernmentCorruptionTimelineImageKey =
		GovernmentCorruptionTimelineImageKey,
> = {
	id: string;
	imageKey: TImageKey;
	sortDate: `${number}-${number}-${number}`;
	dateLabel: string;
	monthLabel: string;
	year: number;
	title: string;
	summary: string;
	whyItMatters: string;
	branch: ReadonlyArray<GovernmentCorruptionTimelineBranch>;
	category: GovernmentCorruptionTimelineCategory;
	severity: GovernmentCorruptionTimelineSeverity;
};

// --- This locks each object key to its matching imageKey value. ---
// --- Example: the 'inauguration-day' slot can only contain imageKey: 'inauguration-day'. ---
export type GovernmentCorruptionTimelineEventMap = {
	readonly [TImageKey in GovernmentCorruptionTimelineImageKey]:
		GovernmentCorruptionTimelineEvent<TImageKey>;
};

export type GovernmentCorruptionTimeline = {
	timelineId: string;
	title: string;
	description: string;
	events: ReadonlyArray<GovernmentCorruptionTimelineEvent>;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
