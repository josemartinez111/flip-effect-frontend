// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > APPROVAL
// > FETCH_APPROVAL_RATING_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import kyMap from 'ky';
import { GlobalEnvs, ST, Utils } from '../../../lib';
import type { ApprovalActionResult } from '../../action-results/ApprovalActionResult';
import type { ApprovalType } from '../../models/ApprovalModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Thin GET to the Cloudflare Worker, which owns the 2 public approval feeds (VoteHub + AP-NORC)
// and its KV cache. The Worker already returns the exact ApprovalActionResult shape (incl. 503).
// ---
export async function fetchApprovalRatingAction(
	approvalType: ApprovalType,
): Promise<ApprovalActionResult> {
	// --- The actual request, handed to Utils.runTryCatch so failures are caught, not thrown. ---
	const fetchApprovalRatingCallback =
		async (): Promise<ApprovalActionResult> => {
			// --- Trim any trailing slash so the path joins cleanly across local/prod origins. ---
			const workerUrl = GlobalEnvs.CivicWorkerUrl.replace(/\/+$/, '');

			// --- ?type IS the ApprovalType discriminator the Worker switches on. ---
			const response = await kyMap.get(`${workerUrl}/api/approval`, {
				searchParams: { type: approvalType },
				throwHttpErrors: false,
			});

			// --- Worker JSON already matches ApprovalActionResult, so the UI never sees raw shapes. ---
			const actionResult = await response.json<ApprovalActionResult>();

			// --- A clean non-2xx isn't thrown, so surface it here: action message + upstream cause, side by side. ---
			if (!actionResult.success) {
				console.error(
					`[approval ${actionResult.statusCode}] ${actionResult.message}${actionResult.error ? ` | ${actionResult.error}` : ''}`,
				);
			}

			return actionResult;
		};

	const approvalResults = await Utils.runTryCatch<ApprovalActionResult>({
		callback: fetchApprovalRatingCallback,
		errorContext: 'Error loading approval rating',
	});

	if (approvalResults.error !== undefined) {
		const failed: ApprovalActionResult = {
			success: false,
			statusCode: ST.INTERNAL_SERVER_ERROR,
			message: 'Approval rating lookup failed.',
			error: approvalResults.error.message,
		};

		return failed;
	}

	return approvalResults.result;
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
