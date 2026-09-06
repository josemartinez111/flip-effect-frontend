// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > APPLICATION
// > APPROVAL_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import { Utils } from '@shared-module/utils';
import type {
	ApprovalActionResult,
	ApprovalRating,
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

// --- Own approval cache orchestration, upstream selection, and the last-good response behavior. ---
export class ApprovalService {
	// ---
	// Read-through with a last-good fail-safe. A fresh cache hit serves instantly; a miss or stale
	// entry re-pulls the source (VoteHub for trump, AP-NORC for economy). If that pull throws, the
	// last cached rating is served instead — never zeros — so the frontend always has a real number.
	// ---
	static async fetchApprovalRating(
		env: WorkerEnv,
		approvalType: ApprovalType,
	): Promise<ApprovalActionResult> {
		let cached: ApprovalRating | null = null;
		const fetchApprovalRatingCallback =
			async (): Promise<ApprovalActionResult> => {
				cached = await readApproval(env, approvalType);

				// --- Fresh cache hit → serve immediately, no upstream call. ---
				if (
					cached &&
					Date.now() - Date.parse(cached.fetchedAt) <
						APPROVAL_FRESH_WINDOW_MS
				) {
					const hit: ApprovalActionResult = {
						success: true,
						statusCode: STATUS.OK,
						message: 'Approval rating loaded.',
						rating: cached,
					};

					return hit;
				}

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
			};
		const approvalResults = await Utils.APITryCatch<ApprovalActionResult>({
			callback: fetchApprovalRatingCallback,
			errorContext: `FETCH_APPROVAL_RATING_${approvalType.toUpperCase()}`,
			failureStatusCode: STATUS.SERVICE_UNAVAILABLE,
		});

		if (approvalResults.error !== undefined) {
			console.error(
				`[approval ${approvalType}] ${approvalResults.error.message}`,
			);

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
				statusCode: approvalResults.statusCode,
				message: 'Approval rating is temporarily unavailable.',
				error: approvalResults.error.message,
			};

			return dead;
		}

		return approvalResults.result;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
