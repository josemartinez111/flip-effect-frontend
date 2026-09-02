// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > REPRESENTATIVES-MODULE
// > CIVIC_DATA_PROVIDERS.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	fetchStatePeopleByDistricts,
	fetchStatePeopleByQuery,
	fetchStateRosterByCode,
	selectStateRepresentatives,
} from '@representatives-module/infrastructure/civicDataProviders';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const kyGetMock = vi.hoisted(() => vi.fn());
const openStatesEnv = {
	OPEN_STATES_API_KEY: 'test-key',
	OPEN_STATES_API_URL: 'https://v3.openstates.org',
};

vi.mock('ky', () => ({
	default: { get: kyGetMock },
}));

describe('representatives-module civic data providers', () => {
	beforeEach(() => {
		kyGetMock.mockReset();
	});

	it('loads only the Census-matched state districts on a cold search', async () => {
		kyGetMock.mockImplementation(
			async (
				_endpoint: string,
				options: { searchParams: URLSearchParams },
			) => ({
				status: 200,
				json: async () => ({
					results: [
						{
							id: `${options.searchParams.get('org_classification')}-${options.searchParams.get('district')}`,
						},
					],
				}),
			}),
		);

		const representatives = await fetchStatePeopleByDistricts(
			openStatesEnv,
			{
				state: 'NC',
				stateHouseDistrict: '038',
				stateSenateDistrict: '14',
			},
		);

		expect(representatives.map(({ id }) => id)).toEqual([
			'lower-38',
			'upper-14',
		]);
		expect(kyGetMock).toHaveBeenCalledTimes(2);
	});

	it('loads one fast page from both state chambers when no address districts exist', async () => {
		kyGetMock.mockImplementation(
			async (
				_endpoint: string,
				options: { searchParams: URLSearchParams },
			) => ({
				status: 200,
				json: async () => ({
					results: [
						{
							id: options.searchParams.get('org_classification'),
						},
					],
				}),
			}),
		);

		const representatives = await fetchStatePeopleByQuery(openStatesEnv, {
			location: { state: 'MA' },
			searchParams: {
				query: 'ma',
				filters: ['house', 'senate', 'state'],
			},
		});

		expect(representatives.map(({ id }) => id)).toEqual([
			'lower',
			'upper',
		]);
		expect(kyGetMock).toHaveBeenCalledTimes(2);

		for (const [, options] of kyGetMock.mock.calls) {
			expect(options.searchParams.get('per_page')).toBe('50');
		}
	});

	it('loads every Open States page for a state roster', async () => {
		kyGetMock
			.mockResolvedValueOnce({
				status: 200,
				json: async () => ({
					pagination: { page: 1, max_page: 2 },
					results: [{ id: 'page-1' }],
				}),
			})
			.mockResolvedValueOnce({
				status: 200,
				json: async () => ({
					pagination: { page: 2, max_page: 2 },
					results: [{ id: 'page-2' }],
				}),
			});

		const representatives = await fetchStateRosterByCode(
			openStatesEnv,
			'NY',
		);

		expect(representatives.map(({ id }) => id)).toEqual([
			'page-1',
			'page-2',
		]);
		expect(kyGetMock).toHaveBeenCalledTimes(2);
	});

	it('matches the Census lower and upper districts against the cached state roster', () => {
		const representatives = selectStateRepresentatives({
			people: [
				{
					id: 'lower-6',
					name: 'Lower District Six',
					current_role: {
						org_classification: 'lower',
						district: '006',
					},
				},
				{
					id: 'lower-7',
					name: 'Lower District Seven',
					current_role: {
						org_classification: 'lower',
						district: '7',
					},
				},
				{
					id: 'upper-12',
					name: 'Upper District Twelve',
					current_role: {
						org_classification: 'upper',
						district: '12',
					},
				},
				{
					id: 'executive',
					name: 'State Executive',
					current_role: {
						org_classification: 'executive',
					},
				},
			],
			location: {
				state: 'NY',
				stateHouseDistrict: '6',
				stateSenateDistrict: '012',
			},
		});

		expect(representatives.map(({ id }) => id)).toEqual([
			'lower-6',
			'upper-12',
		]);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
