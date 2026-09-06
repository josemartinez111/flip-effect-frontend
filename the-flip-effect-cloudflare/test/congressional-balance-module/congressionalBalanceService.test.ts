// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > CONGRESSIONAL-BALANCE-MODULE
// > CONGRESSIONAL_BALANCE_SERVICE.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CongressLegislator } from '@representatives-module/domain/civicUpstreamModel';
import { CongressBalanceService } from '@congressional-balance-module/application/congressionalBalanceService';
import { CONGRESSIONAL_BALANCE_KEY } from '@congressional-balance-module/domain/congressionalBalanceConstants';
import type { CongressionalBalance } from '@congressional-balance-module/domain/congressionalBalanceModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const representativeCacheMocks = vi.hoisted(() => ({
	fetchFreshFederalLegislators: vi.fn(),
	readFederalLegislators: vi.fn(),
}));

vi.mock(
	'@representatives-module/infrastructure/representativesCache',
	() => representativeCacheMocks,
);

describe('congressional balance service', () => {
	beforeEach(() => {
		representativeCacheMocks.fetchFreshFederalLegislators.mockReset();
		representativeCacheMocks.readFederalLegislators.mockReset();
	});
	it('normalizes active voting seats, party aliases, caucuses, and vacancies', () => {
		const legislators: Array<CongressLegislator> = [
			{
				terms: [
					{
						type: 'rep',
						state: 'GA',
						party: 'D',
						start: '2026-09-01',
						end: '2027-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'rep',
						state: 'NY',
						party: 'Republican',
						start: '2025-01-03',
						end: '2027-01-03',
					},
					{
						type: 'sen',
						state: 'NY',
						party: 'Democrat',
						start: '2027-01-03',
						end: '2033-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'rep',
						state: 'CA',
						party: 'Independent',
						caucus: 'Republican',
						start: '2025-01-03',
						end: '2027-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'rep',
						state: 'DC',
						party: 'Democrat',
						start: '2025-01-03',
						end: '2027-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'rep',
						state: 'TX',
						party: 'Republican',
						start: '2023-01-03',
						end: '2025-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'sen',
						state: 'VT',
						party: 'Independent',
						caucus: 'Democrat',
						start: '2025-01-03',
						end: '2031-01-03',
					},
				],
			},
			{
				terms: [
					{
						type: 'sen',
						state: 'OH',
						party: 'Democratic',
						start: '2025-01-03',
						end: '2031-01-03',
					},
				],
			},
		];

		const balance =
			CongressBalanceService.fetchCongressBalanceFromLegislators({
				legislators,
				fetchedAt: '2026-09-02T12:00:00.000Z',
				sourceUrl: 'https://example.test/legislators-current.json',
			});

		expect(balance).toEqual({
			house: {
				chamber: 'house',
				totalSeats: 435,
				filledSeats: 3,
				democrats: 1,
				republicans: 1,
				independents: 1,
				democraticCaucus: 1,
				republicanCaucus: 2,
				vacancies: 432,
			},
			senate: {
				chamber: 'senate',
				totalSeats: 100,
				filledSeats: 2,
				democrats: 1,
				republicans: 0,
				independents: 1,
				democraticCaucus: 2,
				republicanCaucus: 0,
				vacancies: 98,
			},
			source: 'Congress Legislators',
			sourceUrl: 'https://example.test/legislators-current.json',
			fetchedAt: '2026-09-02T12:00:00.000Z',
		});
	});

	it('preserves the last-good compact balance when the fresh roster is unavailable', async () => {
		const lastGood: CongressionalBalance = {
			house: {
				chamber: 'house',
				totalSeats: 435,
				filledSeats: 432,
				democrats: 213,
				republicans: 218,
				independents: 1,
				democraticCaucus: 213,
				republicanCaucus: 219,
				vacancies: 3,
			},
			senate: {
				chamber: 'senate',
				totalSeats: 100,
				filledSeats: 100,
				democrats: 45,
				republicans: 53,
				independents: 2,
				democraticCaucus: 47,
				republicanCaucus: 53,
				vacancies: 0,
			},
			source: 'Congress Legislators',
			sourceUrl: 'https://example.test/legislators-current.json',
			fetchedAt: '2026-09-01T12:00:00.000Z',
		};

		await env.REPRESENTATIVES_CACHE.put(
			CONGRESSIONAL_BALANCE_KEY,
			JSON.stringify(lastGood),
		);
		representativeCacheMocks.fetchFreshFederalLegislators.mockResolvedValue(
			[],
		);

		await expect(
			CongressBalanceService.fetchFreshCongressBalance(env),
		).rejects.toThrow(
			'The fresh federal legislator roster is unavailable.',
		);

		const preserved =
			await env.REPRESENTATIVES_CACHE.get<CongressionalBalance>(
				CONGRESSIONAL_BALANCE_KEY,
				'json',
			);

		expect(preserved).toEqual(lastGood);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
