// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > HEALTH-CHECK-MODULE > PRESENTATION
// > HEALTH_CHECK_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type { HttpStatus } from '@shared-module/httpStatus';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Smoke-test contract: scaffold a new worker, hit this, get a typed 200 → wiring proven. ---
type HealthCheckResult = {
	status: 'ok' | 'unavailable';
	statusCode: HttpStatus;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- 
// Typed handler factory bound to the Worker env 
// (extracted handler, never inlined at the route). 
// ---
const workerFactory = createFactory<WorkerHonoEnv>();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- GET /api/health-check → 200 healthy; ?fail=true simulates a 503 (mirrors the .NET HealthCheckModule). ---
const healthCheckHandlers = workerFactory.createHandlers((ctx) => {
	try {
		// --- Manual failure switch so the unhealthy path is testable without breaking anything real. ---
		const simulateFailure =
			ctx.req.query('fail')?.toLowerCase() === 'true';

		if (simulateFailure) {
			console.warn('[HealthCheck] Simulated failure via query param.');

			const unavailable: HealthCheckResult = {
				status: 'unavailable',
				statusCode: STATUS.SERVICE_UNAVAILABLE,
			};

			return ctx.json(unavailable, unavailable.statusCode);
		}

		const healthy: HealthCheckResult = {
			status: 'ok',
			statusCode: STATUS.OK,
		};

		return ctx.json(healthy, healthy.statusCode);
	} catch (error: unknown) {
		console.error(error instanceof Error ? error.message : String(error));

		const failed: HealthCheckResult = {
			status: 'unavailable',
			statusCode: STATUS.INTERNAL_SERVER_ERROR,
		};

		return ctx.json(failed, failed.statusCode);
	}
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// --- 
// Route group (declared here like a .NET 
// endpoint class; mounted under /api in app.ts). 
// ---
const healthCheckRoutes = new Hono<WorkerHonoEnv>();

healthCheckRoutes.get(
	'/health-check', 
	...healthCheckHandlers
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
export { healthCheckRoutes };
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
