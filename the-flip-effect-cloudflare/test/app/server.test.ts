// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > APP
// > SERVER.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { scheduled } from '@app/server';
import { DAILY_CONGRESSIONAL_BALANCE_CRON } from '@congressional-balance-module/domain/congressionalBalanceConstants';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const congressionalBalanceServiceMock = vi.hoisted(() => ({
	fetchCronsCongressBalance: vi.fn(),
}));
const representativeCacheMocks = vi.hoisted(() => ({
	seedAllStates: vi.fn(),
}));
const householdPriceServiceMock = vi.hoisted(() => ({
	fetchCronsHouseholdPrice: vi.fn(),
}));
const tariffActivityServiceMock = vi.hoisted(() => ({
	fetchCronsTariffActivity: vi.fn(),
}));

vi.mock(
	'@congressional-balance-module/application/congressionalBalanceService',
	() => ({ CongressBalanceService: congressionalBalanceServiceMock }),
);
vi.mock(
	'@representatives-module/infrastructure/representativesCache',
	() => representativeCacheMocks,
);
vi.mock('@economy-module/application/householdPriceService', () => ({
	HouseholdPriceService: householdPriceServiceMock,
}));
vi.mock('@economy-module/application/tariffActivityService', () => ({
	TariffActivityService: tariffActivityServiceMock,
}));

describe('scheduled worker jobs', () => {
	beforeEach(() => {
		tariffActivityServiceMock.fetchCronsTariffActivity.mockReset();
		tariffActivityServiceMock.fetchCronsTariffActivity.mockResolvedValue(
			undefined,
		);
		congressionalBalanceServiceMock.fetchCronsCongressBalance.mockReset();
		representativeCacheMocks.seedAllStates.mockReset();
		householdPriceServiceMock.fetchCronsHouseholdPrice.mockReset();
		householdPriceServiceMock.fetchCronsHouseholdPrice.mockResolvedValue(
			undefined,
		);
		congressionalBalanceServiceMock.fetchCronsCongressBalance.mockResolvedValue(
			undefined,
		);
		representativeCacheMocks.seedAllStates.mockResolvedValue(undefined);
	});

	it('runs federal balance, household-price, and Treasury refreshes on the daily cron', async () => {
		const promises: Array<Promise<unknown>> = [];
		const executionContext = {
			waitUntil: (promise: Promise<unknown>): void => {
				promises.push(promise);
			},
		};

		scheduled(
			{ cron: DAILY_CONGRESSIONAL_BALANCE_CRON },
			env,
			executionContext,
		);
		await Promise.all(promises);
		expect(
			tariffActivityServiceMock.fetchCronsTariffActivity,
		).toHaveBeenCalledOnce();

		expect(
			congressionalBalanceServiceMock.fetchCronsCongressBalance,
		).toHaveBeenCalledOnce();
		expect(representativeCacheMocks.seedAllStates).not.toHaveBeenCalled();
		expect(
			householdPriceServiceMock.fetchCronsHouseholdPrice,
		).toHaveBeenCalledOnce();
	});

	it('keeps the existing state-roster seed on the weekly cron', async () => {
		const promises: Array<Promise<unknown>> = [];
		const executionContext = {
			waitUntil: (promise: Promise<unknown>): void => {
				promises.push(promise);
			},
		};

		scheduled({ cron: '0 9 * * 1' }, env, executionContext);
		await Promise.all(promises);
		expect(
			tariffActivityServiceMock.fetchCronsTariffActivity,
		).not.toHaveBeenCalled();

		expect(representativeCacheMocks.seedAllStates).toHaveBeenCalledOnce();
		expect(
			householdPriceServiceMock.fetchCronsHouseholdPrice,
		).not.toHaveBeenCalled();
		expect(
			congressionalBalanceServiceMock.fetchCronsCongressBalance,
		).not.toHaveBeenCalled();
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
