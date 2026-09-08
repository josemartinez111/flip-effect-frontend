// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > SERVER.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Context, Hono } from 'hono';
import { logger } from 'hono/logger';
import type { WorkerEnv, WorkerHonoEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import { seedAllStates } from '@representatives-module/infrastructure/representativesCache';
import { CongressBalanceService } from '@congressional-balance-module/application/congressionalBalanceService';
import { DAILY_CONGRESSIONAL_BALANCE_CRON } from '@congressional-balance-module/domain/congressionalBalanceConstants';
import { HouseholdPriceService } from '@economy-module/application/householdPriceService';
import { TariffActivityService } from '@economy-module/application/tariffActivityService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- The server: base Hono app + cross-cutting middleware. Routes get mounted onto it in app.ts. ---
export const app = new Hono<WorkerHonoEnv>();

// --- Real request logging (method, path, status, timing) — the middleware pipeline a Honda never had. ---
app.use(logger());

// --- Global error net: known outcomes return their own shape; any uncaught throw degrades to a clean 500. ---
app.onError((error, ctx: Context<WorkerHonoEnv>) => {
	console.error(error instanceof Error ? error.message : String(error));

	const response = ctx.json(
		{
			success: false,
			statusCode: STATUS.INTERNAL_SERVER_ERROR,
			message: 'Unexpected server error.',
		},
		STATUS.INTERNAL_SERVER_ERROR,
	);

	return response;
});

// --- Refresh each snapshot independently; a failed Treasury pull must not block seats or household-price research. ---
export const scheduled = (
	event: Pick<ScheduledController, 'cron'>,
	env: WorkerEnv,
	ctx: Pick<ExecutionContext, 'waitUntil'>,
): void => {
	if (event.cron === DAILY_CONGRESSIONAL_BALANCE_CRON) {
		ctx.waitUntil(CongressBalanceService.fetchCronsCongressBalance(env));
		ctx.waitUntil(HouseholdPriceService.fetchCronsHouseholdPrice(env));
		ctx.waitUntil(TariffActivityService.fetchCronsTariffActivity(env));

		return;
	}

	ctx.waitUntil(seedAllStates(env));
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
