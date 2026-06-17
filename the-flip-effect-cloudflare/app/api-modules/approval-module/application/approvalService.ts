// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > APPLICATION
// > APPROVAL_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type {
	ApprovalActionResult,
	ApprovalPoll,
	ApprovalRating,
	ApprovalType,
} from '@approval-module/domain/approvalModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Orchestration + I/O inlined (no separate provider). The ApprovalType discriminator
// picks which PUBLIC feed to hit:
//   - 'trump'   → env.VOTEHUB_API_URL  (VoteHub: ?poll_type=approval&subject=donald-trump)
//   - 'economy' → env.ECONOMY_API_URL  (TODO: confirm the public economy-approval source)
// TODO: real ky.get per branch + KV read-through (env.APPROVAL_CACHE via approvalCacheKey),
// then average approve/disapprove. Rename `_env` → `env` once a binding is read.
// ---
export const fetchApprovalRating = async (
	_env: WorkerEnv,
	approvalType: ApprovalType,
): Promise<ApprovalActionResult> => {
	try {
		// --- Pick the feed by discriminator + fetch (placeholder). ---
		let polls: Array<ApprovalPoll> = [];

		switch (approvalType) {
			case 'trump': {
				// TODO: polls = await ky.get(env.VOTEHUB_API_URL, { searchParams: VOTEHUB_TRUMP_QUERY, throwHttpErrors: false }).json<Array<ApprovalPoll>>();
				break;
			}

			case 'economy': {
				// TODO: polls = await ky.get(env.ECONOMY_API_URL, { ... }).json<Array<ApprovalPoll>>();
				break;
			}
		}

		// --- TODO: average across polls; placeholder zeros until the fetch is wired. ---
		const rating: ApprovalRating = {
			approvalType,
			approve: 0,
			disapprove: 0,
			polls,
		};

		// --- Empty → 404 (still echo the type); else 200. ---
		const result: ApprovalActionResult =
			polls.length === 0
				? {
						success: false,
						statusCode: STATUS.NOT_FOUND,
						message: 'No approval data available yet.',
						rating,
					}
				: {
						success: true,
						statusCode: STATUS.OK,
						message: 'Approval rating loaded.',
						rating,
					};

		return result;
	} catch (error: unknown) {
		// --- Any upstream throw lands here as a 500 with the raw cause attached. ---
		const cause = error instanceof Error ? error.message : String(error);
		console.error(cause);

		const result: ApprovalActionResult = {
			success: false,
			statusCode: STATUS.INTERNAL_SERVER_ERROR,
			message: 'Approval lookup failed.',
			error: cause,
		};

		return result;
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
