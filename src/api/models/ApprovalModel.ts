// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: MODELS
// > APPROVAL_MODEL.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Which approval feed the Worker fetched: trump overall (VoteHub) or economy (AP-NORC). ---
export type ApprovalType = 'trump' | 'economy';

// --- One normalized poll row backing the aggregate (pollster + its approve/disapprove + fieldwork date). ---
export type ApprovalPoll = {
	pollster: string;
	approve: number;
	disapprove: number;
	date: string;
};

// --- Aggregated rating the Worker returns; `source` + `fetchedAt` drive the caption + "last updated" hover. ---
export type ApprovalRating = {
	approvalType: ApprovalType;
	approve: number;
	disapprove: number;
	polls: Array<ApprovalPoll>;
	source: string;
	fetchedAt: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
