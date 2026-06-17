// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > PRESENTATION
// > APPROVAL_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type { ApprovalActionResult } from '@approval-module/domain/approvalModel';
import { fetchApprovalRating } from '@approval-module/application/approvalService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Typed handler factory bound to the Worker env (extracted handler, never inlined at the route). ---
const workerFactory = createFactory<WorkerHonoEnv>();

// ---
// GET /api/approval?type=trump|economy → ApprovalActionResult JSON.
// The ?type query IS the ApprovalType discriminator the service + provider switch on.
// ---
const approvalHandlers = workerFactory.createHandlers(async (ctx) => {
	const approvalType = ctx.req.query('type');

	// --- Validate the discriminator before it reaches the switch downstream. ---
	if (approvalType !== 'trump' && approvalType !== 'economy') {
		const invalid: ApprovalActionResult = {
			success: false,
			statusCode: STATUS.BAD_REQUEST,
			message: "Query ?type must be 'trump' or 'economy'.",
		};

		return ctx.json(invalid, invalid.statusCode);
	}

	const result = await fetchApprovalRating(ctx.env, approvalType);

	return ctx.json(result, result.statusCode);
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// --- Route group (declared here like a .NET endpoint class; mounted under /api in app.ts). ---
const approvalRoutes = new Hono<WorkerHonoEnv>();
approvalRoutes.get('/approval', ...approvalHandlers);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
export { approvalRoutes };
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
