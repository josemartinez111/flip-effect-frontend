// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > HEALTH-CHECK-MODULE > PRESENTATION
// > HEALTH_CHECK_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import type { Context } from 'hono';
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

// --- Own the health-check route group and private handler like the Elysia health endpoint. ---
export class HealthCheckEndpoints {
	static mappedHealthCheckRoutes(): Hono<WorkerHonoEnv> {
		const healthCheckRoutes = new Hono<WorkerHonoEnv>();
		healthCheckRoutes.get(
			'/health-check',
			HealthCheckEndpoints.fetchHealthCheckAsync,
		);

		return healthCheckRoutes;
	}

	// --- GET /api/health-check → 200 healthy; ?fail=true simulates a 503. ---
	private static fetchHealthCheckAsync(
		ctx: Context<WorkerHonoEnv>,
	): Response {
		// --- Manual failure switch so the unhealthy path is testable without breaking anything real. ---
		const simulateFailure =
			ctx.req.query('fail')?.toLowerCase() === 'true';

		if (simulateFailure) {
			console.warn('[HealthCheck] Simulated failure via query param.');

			const unavailable: HealthCheckResult = {
				status: 'unavailable',
				statusCode: STATUS.SERVICE_UNAVAILABLE,
			};
			const response = ctx.json(unavailable, unavailable.statusCode);

			return response;
		}

		const healthy: HealthCheckResult = {
			status: 'ok',
			statusCode: STATUS.OK,
		};
		const response = ctx.json(healthy, healthy.statusCode);

		return response;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
