// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > REPRESENTATIVES-MODULE
// > REPRESENTATIVES_CACHE.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { env } from 'cloudflare:test';
import { describe, expect, it, vi } from 'vitest';
import type { CongressLegislator } from '@representatives-module/domain/civicUpstreamModel';
import { FEDERAL_LEGISLATORS_KEY } from '@representatives-module/domain/representativeConstants';
import { fetchFreshFederalLegislators } from '@representatives-module/infrastructure/representativesCache';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const providerMocks = vi.hoisted(() => ({
	fetchFederalLegislators: vi.fn(),
	fetchStateRosterByCode: vi.fn(),
}));

vi.mock(
	'@representatives-module/infrastructure/civicDataProviders',
	() => providerMocks,
);

describe('representatives cache', () => {
	it('keeps the last-good federal roster when a fresh download is empty', async () => {
		const lastGood: Array<CongressLegislator> = [
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
		];

		await env.REPRESENTATIVES_CACHE.put(
			FEDERAL_LEGISLATORS_KEY,
			JSON.stringify(lastGood),
		);
		providerMocks.fetchFederalLegislators.mockResolvedValue([]);

		const fresh = await fetchFreshFederalLegislators(env);
		const preserved = await env.REPRESENTATIVES_CACHE.get<
			Array<CongressLegislator>
		>(FEDERAL_LEGISLATORS_KEY, 'json');

		expect(fresh).toEqual([]);
		expect(preserved).toEqual(lastGood);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
