// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > DOMAIN
// > APPROVAL_CONSTANTS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { ApprovalType } from '@approval-module/domain/approvalModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Weekly cache window (cron seeds both feeds; read-through fills misses). ---
export const APPROVAL_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

// --- KV key per feed so trump + economy cache side by side. ---
export const approvalCacheKey = (approvalType: ApprovalType): string =>
	`approval:${approvalType}`;

// --- VoteHub query for presidential approval (subject is a person, not an issue). ---
export const VOTEHUB_TRUMP_QUERY = {
	poll_type: 'approval',
	subject: 'donald-trump',
} as const;

// TODO: economy feed query/params once the public economy-approval source is confirmed.
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
