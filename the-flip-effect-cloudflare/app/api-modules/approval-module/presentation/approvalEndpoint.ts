// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > PRESENTATION
// > APPROVAL_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type { ApprovalActionResult } from '@approval-module/domain/approvalModel';
import { ApprovalService } from '@approval-module/application/approvalService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Own the approval route group and its handler as one presentation surface. app.ts only mounts
// the completed group, matching the endpoint-class structure used by the Elysia API.
// ---
export class ApprovalEndpoints {
	static mappedApprovalRoutes(): Hono<WorkerHonoEnv> {
		const approvalRoutes = new Hono<WorkerHonoEnv>();
		approvalRoutes.get(
			'/approval',
			ApprovalEndpoints.fetchApprovalRatingAsync,
		);

		return approvalRoutes;
	}

	// --- GET /api/approval?type=trump|economy → ApprovalActionResult JSON. ---
	private static async fetchApprovalRatingAsync(
		ctx: Context<WorkerHonoEnv>,
	): Promise<Response> {
		const approvalType = ctx.req.query('type');

		// --- Validate the discriminator before it reaches the service's source switch. ---
		if (approvalType !== 'trump' && approvalType !== 'economy') {
			const invalid: ApprovalActionResult = {
				success: false,
				statusCode: STATUS.BAD_REQUEST,
				message: "Query ?type must be 'trump' or 'economy'.",
			};

			const response = ctx.json(invalid, invalid.statusCode);
			return response;
		}

		const result = await ApprovalService.fetchApprovalRating(
			ctx.env,
			approvalType,
		);

		const response = ctx.json(result, result.statusCode);
		return response;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
