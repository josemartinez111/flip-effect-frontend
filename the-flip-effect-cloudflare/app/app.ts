// FILE: APP.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//               MAIN_ENTRY >> APP.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                          IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { cors } from 'hono/cors';
import type { WorkerEnv } from '@shared-module/worker-env';
import { app, scheduled } from '@app/server';
import { HealthCheckEndpoints } from '@health-check-module/presentation/healthCheckEndpoint';
import { RepresentativesEndpoints } from '@representatives-module/presentation/representativesEndpoint';
import { ApprovalEndpoints } from '@approval-module/presentation/approvalEndpoint';
import { CongressBalanceEndpoints } from '@congressional-balance-module/presentation/congressionalBalanceEndpoint';
import { TariffActivityEndpoints } from '@economy-module/presentation/tariffActivityEndpoint';
import { HouseholdPriceEndpoints } from '@economy-module/presentation/householdPriceEndpoint';
import { seedRepsOnNewVersion } from '@representatives-module/application/representativesSeedOnDeploy';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                        MIDDLEWARE
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Composition root (Program.cs analog): apply CORS + mount the route groups
// under /api. CORS allowlist is `env` config; the Origin is echoed only when
// it matches (like a RequireCors policy).
// ---
app.use('/api/*', (ctx, next: () => Promise<void>) => {
	const allowlistCors = cors({
		origin: (origin: string) =>
			ctx.env.ALLOWED_ORIGINS.includes(origin) ? origin : '',
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['content-type'],
	});

	return allowlistCors(ctx, next);
});

// ---
// Deploy-bound cache refresh: the first request after a new Worker version kicks the
// representatives get-all once, in the background (ctx.waitUntil) — never blocks the response.
// ---
app.use('*', async (ctx, next: () => Promise<void>) => {
	seedRepsOnNewVersion(ctx.env, ctx.executionCtx);

	await next();
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                    HTTP_HANDLERS/ROUTES
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

app.route('/api', HealthCheckEndpoints.mappedHealthCheckRoutes());
app.route('/api', RepresentativesEndpoints.mappedRepresentativesRoutes());
app.route('/api', ApprovalEndpoints.mappedApprovalRoutes());
app.route('/api', CongressBalanceEndpoints.mappedCongressBalanceRoutes());
app.route('/api', TariffActivityEndpoints.mappedTariffActivityRoutes());
app.route('/api', HouseholdPriceEndpoints.mappedHouseholdPriceRoutes());
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                     EXPORTED_HANDLER
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Cloudflare's dated rule still demands `export default {}`,
// so compose fetch + cron here and ship it.
// ---
const worker: ExportedHandler<WorkerEnv> = {
	fetch: app.fetch,
	scheduled,
};

// noinspection JSUnusedGlobalSymbols
export default worker;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
