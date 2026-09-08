// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > PRESENTATION > TARIFF_ACTIVITY_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono, type Context } from 'hono';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { TariffActivityService } from '@economy-module/application/tariffActivityService';

// --- Presentation owns only route mapping and HTTP serialization; services own cache and upstream decisions. ---
export class TariffActivityEndpoints {
	static mappedTariffActivityRoutes(): Hono<WorkerHonoEnv> {
		const tariffRoutes = new Hono<WorkerHonoEnv>();
		tariffRoutes.get(
			'/economy/tariffs',
			TariffActivityEndpoints.fetchTariffActivityAsync,
		);

		return tariffRoutes;
	}

	private static async fetchTariffActivityAsync(
		ctx: Context<WorkerHonoEnv>,
	): Promise<Response> {
		const result = await TariffActivityService.fetchTariffActivity(
			ctx.env,
			ctx.executionCtx,
		);
		const response = ctx.json(result, result.statusCode);

		return response;
	}
}
