// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > HEALTH-CHECK-MODULE
// > HEALTH_CHECK.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Default scaffold smoke test: SELF.fetch runs the real worker (app.ts) end to end, so a green run proves Hono + routing + bindings are all wired. ---
describe('health-check-module', () => {
	it('GET /api/health-check → 200 healthy', async () => {
		const response = await SELF.fetch(
			'https://worker.test/api/health-check',
		);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			status: 'ok',
			statusCode: 200,
		});
	});

	it('GET /api/health-check?fail=true → 503 unavailable', async () => {
		const response = await SELF.fetch(
			'https://worker.test/api/health-check?fail=true',
		);

		expect(response.status).toBe(503);
		expect(await response.json()).toMatchObject({
			status: 'unavailable',
			statusCode: 503,
		});
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
