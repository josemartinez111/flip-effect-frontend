// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > REPRESENTATIVES-MODULE
// > REPRESENTATIVES_SERVICE.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WorkerEnv } from '@shared-module/worker-env';
import type { CivicRepresentativeRecord } from '@representatives-module/domain/representativeModel';
import { RepresentativesService } from '@representatives-module/application/representativesService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const providerMocks = vi.hoisted(() => ({
	buildStateRecord: vi.fn(),
	fetchAddressLocation: vi.fn(),
	fetchStatePeopleByDistricts: vi.fn(),
	fetchStatePeopleByQuery: vi.fn(),
	selectFederalRepresentatives: vi.fn(),
	selectStateRepresentatives: vi.fn(),
}));
const cacheMocks = vi.hoisted(() => ({
	fetchCachedStateLegislators: vi.fn(),
	readFederalLegislators: vi.fn(),
}));

vi.mock(
	'@representatives-module/infrastructure/civicDataProviders',
	() => providerMocks,
);

vi.mock(
	'@representatives-module/infrastructure/representativesCache',
	() => cacheMocks,
);

const unusedCache: KVNamespace = {
	delete: vi.fn(),
	get: vi.fn(),
	getWithMetadata: vi.fn(),
	list: vi.fn(),
	put: vi.fn(),
};
const workerEnv: WorkerEnv = {
	ALLOWED_ORIGINS: ['http://localhost:5173'],
	APNORC_WP_API_URL: 'https://example.test/apnorc',
	APPROVAL_CACHE: unusedCache,
	CENSUS_GEOCODER_API_URL: 'https://example.test/census',
	CF_VERSION_METADATA: {
		id: 'test-version',
		tag: 'test',
		timestamp: '2026-07-18T00:00:00.000Z',
	},
	CONGRESS_LEGISLATOR_IMAGE_BASE_URL: 'https://example.test/images',
	CONGRESS_LEGISLATORS_CURRENT_URL: 'https://example.test/congress',
	NYT_APPROVAL_URL: 'https://example.test/nyt',
	OPEN_STATES_API_KEY: 'test-key',
	OPEN_STATES_API_URL: 'https://example.test/open-states',
	REPRESENTATIVES_CACHE: unusedCache,
};

describe('representatives service', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('keeps successful federal results when the state source fails on Both', async () => {
		const federalRepresentative: CivicRepresentativeRecord = {
			id: 'federal-house',
			source: 'federal',
			fullName: 'Federal House Member',
			party: 'Independent',
			state: 'NC',
			chamber: 'house',
		};
		providerMocks.fetchAddressLocation.mockResolvedValue({
			state: 'NC',
			congressionalDistrict: '2',
			stateHouseDistrict: '38',
			stateSenateDistrict: '14',
		});
		cacheMocks.readFederalLegislators.mockResolvedValue([]);
		providerMocks.selectFederalRepresentatives.mockReturnValue([
			federalRepresentative,
		]);
		cacheMocks.fetchCachedStateLegislators.mockResolvedValue(undefined);
		providerMocks.fetchStatePeopleByDistricts.mockRejectedValue(
			new Error('Open States timed out'),
		);
		const result =
			await RepresentativesService.fetchRepresentativesBySearch(
				workerEnv,
				{
					query: '1 E Edenton St, Raleigh, NC 27601',
					filters: ['house', 'senate', 'state'],
				},
			);

		expect(result.success).toBe(true);
		expect(result.statusCode).toBe(200);
		expect(result.civicRepresentatives?.representatives).toEqual([
			federalRepresentative,
		]);
		expect(
			providerMocks.fetchStatePeopleByDistricts,
		).toHaveBeenCalledOnce();
	});

	it('uses the fast broad state lookup when Both has no address districts', async () => {
		providerMocks.fetchAddressLocation.mockResolvedValue({ state: 'MA' });
		cacheMocks.readFederalLegislators.mockResolvedValue([]);
		providerMocks.selectFederalRepresentatives.mockReturnValue([]);
		cacheMocks.fetchCachedStateLegislators.mockResolvedValue(undefined);
		providerMocks.fetchStatePeopleByQuery.mockResolvedValue([
			{
				id: 'lower',
				name: 'Lower Chamber Member',
				current_role: { org_classification: 'lower' },
			},
			{
				id: 'upper',
				name: 'Upper Chamber Member',
				current_role: { org_classification: 'upper' },
			},
		]);
		providerMocks.buildStateRecord.mockImplementation(
			(person: { id: string; name: string }) => ({
				id: person.id,
				source: 'state',
				fullName: person.name,
				party: 'Independent',
				state: 'MA',
				chamber: person.id,
			}),
		);

		const result =
			await RepresentativesService.fetchRepresentativesBySearch(
				workerEnv,
				{
					query: 'ma',
					filters: ['house', 'senate', 'state'],
				},
			);

		expect(result.success).toBe(true);
		expect(providerMocks.fetchStatePeopleByQuery).toHaveBeenCalledOnce();
		expect(
			result.civicRepresentatives?.representatives.map(
				({ chamber }) => chamber,
			),
		).toEqual(['lower', 'upper']);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
