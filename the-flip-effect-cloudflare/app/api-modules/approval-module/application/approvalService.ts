// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > APPLICATION
// > APPROVAL_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type {
	ApprovalActionResult,
	ApprovalType,
} from '@approval-module/domain/approvalModel';
import { APPROVAL_FRESH_WINDOW_MS } from '@approval-module/domain/approvalConstants';
import {
	readApproval,
	writeApproval,
} from '@approval-module/infrastructure/approvalCache';
import {
	fetchApnorcEconomy,
	fetchNytTrump,
} from '@approval-module/infrastructure/approvalSources';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Read-through with a last-good fail-safe. A fresh cache hit serves instantly; a miss or stale
// entry re-pulls the source (VoteHub for trump, AP-NORC for economy). If that pull throws, the
// last cached rating is served instead — never zeros — so the frontend always has a real number.
// ---
export const fetchApprovalRating = async (
	env: WorkerEnv,
	approvalType: ApprovalType,
): Promise<ApprovalActionResult> => {
	const cached = await readApproval(env, approvalType);

	// --- Fresh cache hit → serve immediately, no upstream call. ---
	if (
		cached &&
		Date.now() - Date.parse(cached.fetchedAt) < APPROVAL_FRESH_WINDOW_MS
	) {
		const hit: ApprovalActionResult = {
			success: true,
			statusCode: STATUS.OK,
			message: 'Approval rating loaded.',
			rating: cached,
		};

		return hit;
	}

	try {
		// --- Miss or stale → pull the source for this discriminator, then cache it. ---
		const fresh =
			approvalType === 'trump'
				? await fetchNytTrump(env)
				: await fetchApnorcEconomy(env);

		await writeApproval(env, approvalType, fresh);

		const ok: ApprovalActionResult = {
			success: true,
			statusCode: STATUS.OK,
			message: 'Approval rating loaded.',
			rating: fresh,
		};

		return ok;
	} catch (error: unknown) {
		const cause = error instanceof Error ? error.message : String(error);
		console.error(`[approval ${approvalType}] ${cause}`);

		// --- Fail-safe: serve the last-good cache rather than zeros. ---
		if (cached) {
			const stale: ApprovalActionResult = {
				success: true,
				statusCode: STATUS.OK,
				message: 'Approval rating loaded (cached).',
				rating: cached,
			};

			return stale;
		}

		const dead: ApprovalActionResult = {
			success: false,
			statusCode: STATUS.SERVICE_UNAVAILABLE,
			message: 'Approval rating is temporarily unavailable.',
			error: cause,
		};

		return dead;
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
