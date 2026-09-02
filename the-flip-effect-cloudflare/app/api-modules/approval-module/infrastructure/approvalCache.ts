// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > INFRASTRUCTURE
// > APPROVAL_CACHE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import type {
	ApprovalRating,
	ApprovalType,
} from '@approval-module/domain/approvalModel';
import {
	APPROVAL_CACHE_TTL_SECONDS,
	approvalCacheKey,
} from '@approval-module/domain/approvalConstants';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Read the cached rating for a feed. The service decides fresh-vs-last-good by the rating's `fetchedAt`. ---
export const readApproval = (
	env: WorkerEnv,
	approvalType: ApprovalType,
): Promise<ApprovalRating | null> =>
	env.APPROVAL_CACHE.get<ApprovalRating>(
		approvalCacheKey(approvalType),
		'json',
	);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Persist a freshly fetched rating. The long TTL keeps it alive as the fail-safe well past the poll cadence. ---
export const writeApproval = (
	env: WorkerEnv,
	approvalType: ApprovalType,
	rating: ApprovalRating,
): Promise<void> =>
	env.APPROVAL_CACHE.put(
		approvalCacheKey(approvalType),
		JSON.stringify(rating),
		{
			expirationTtl: APPROVAL_CACHE_TTL_SECONDS,
			metadata: { seededAt: Date.now() },
		},
	);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
