// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > CONGRESSIONAL-BALANCE-MODULE
// > CONGRESSIONAL_BALANCE_ENDPOINT.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { env, SELF } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import type { CongressLegislator } from '@representatives-module/domain/civicUpstreamModel';
import { FEDERAL_LEGISLATORS_KEY } from '@representatives-module/domain/representativeConstants';
import { CONGRESSIONAL_BALANCE_KEY } from '@congressional-balance-module/domain/congressionalBalanceConstants';
import type {
	CongressionalBalance,
	CongressionalBalanceActionResult,
} from '@congressional-balance-module/domain/congressionalBalanceModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

afterEach(async () => {
	await Promise.all([
		env.REPRESENTATIVES_CACHE.delete(CONGRESSIONAL_BALANCE_KEY),
		env.REPRESENTATIVES_CACHE.delete(FEDERAL_LEGISLATORS_KEY),
	]);
});

describe('congressional balance endpoint', () => {
	it('derives and stores the compact balance from the existing KV roster', async () => {
		const legislators: Array<CongressLegislator> = [
			{
				terms: [
					{
						type: 'rep',
						state: 'MA',
						party: 'Democrat',
						start: '2025-01-03',
						end: '2027-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'sen',
						state: 'MA',
						party: 'Republican',
						start: '2025-01-03',
						end: '2031-01-03',
					},
				],
			},
		];
		const seededAt = Date.parse('2026-09-02T12:00:00.000Z');

		await env.REPRESENTATIVES_CACHE.put(
			FEDERAL_LEGISLATORS_KEY,
			JSON.stringify(legislators),
			{ metadata: { seededAt } },
		);

		const response = await SELF.fetch(
			'https://worker.test/api/congressional-balance',
		);
		const result = await response.json<CongressionalBalanceActionResult>();
		const cachedBalance =
			await env.REPRESENTATIVES_CACHE.get<CongressionalBalance>(
				CONGRESSIONAL_BALANCE_KEY,
				'json',
			);

		expect(response.status).toBe(200);
		expect(result.success).toBe(true);
		expect(result.congressionalBalance?.house).toMatchObject({
			democrats: 1,
			filledSeats: 1,
			vacancies: 434,
		});
		expect(result.congressionalBalance?.senate).toMatchObject({
			republicans: 1,
			filledSeats: 1,
			vacancies: 99,
		});
		expect(result.congressionalBalance?.fetchedAt).toBe(
			'2026-09-02T12:00:00.000Z',
		);
		expect(cachedBalance).toEqual(result.congressionalBalance);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
