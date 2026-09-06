// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > CONGRESSIONAL-BALANCE-MODULE > PRESENTATION
// > CONGRESSIONAL_BALANCE_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { CongressBalanceService } from '@congressional-balance-module/application/congressionalBalanceService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Own the congressional-balance route group and private handler as one presentation surface. ---
export class CongressBalanceEndpoints {
	static mappedCongressBalanceRoutes(): Hono<WorkerHonoEnv> {
		const congressionalBalanceRoutes = new Hono<WorkerHonoEnv>();
		
		congressionalBalanceRoutes.get(
			'/congressional-balance',
			CongressBalanceEndpoints.fetchCongressBalanceAsync,
		);

		return congressionalBalanceRoutes;
	}

	// --- GET /api/congressional-balance returns the compact cache-backed balance contract. ---
	private static async fetchCongressBalanceAsync(
		ctx: Context<WorkerHonoEnv>,
	): Promise<Response> {
		const result = await CongressBalanceService.fetchCongressBalance(
			ctx.env,
		);
		
		const response = ctx.json(result, result.statusCode);
		return response;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
