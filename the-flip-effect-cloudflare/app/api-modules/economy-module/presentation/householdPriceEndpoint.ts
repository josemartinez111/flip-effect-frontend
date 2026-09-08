// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > ECONOMY-MODULE > PRESENTATION > HOUSEHOLD_PRICE_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono, type Context } from 'hono';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { HouseholdPriceService } from '@economy-module/application/householdPriceService';

// --- Keep route composition and serialization separate from the data/cache service. ---
export class HouseholdPriceEndpoints {
	static mappedHouseholdPriceRoutes(): Hono<WorkerHonoEnv> {
		const routes = new Hono<WorkerHonoEnv>();
		routes.get(
			'/economy/household-prices',
			HouseholdPriceEndpoints.fetchHouseholdPricesAsync,
		);

		return routes;
	}

	private static async fetchHouseholdPricesAsync(
		ctx: Context<WorkerHonoEnv>,
	): Promise<Response> {
		const result = await HouseholdPriceService.fetchHouseholdPrices(
			ctx.env,
			ctx.executionCtx,
		);
		const response = ctx.json(result, result.statusCode);

		return response;
	}
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
