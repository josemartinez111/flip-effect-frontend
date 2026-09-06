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

vi.mock(
	'@congressional-balance-module/application/congressionalBalanceService',
	() => ({ CongressBalanceService: congressionalBalanceServiceMock }),
);
vi.mock(
	'@representatives-module/infrastructure/representativesCache',
	() => representativeCacheMocks,
);

describe('scheduled worker jobs', () => {
	beforeEach(() => {
		congressionalBalanceServiceMock.fetchCronsCongressBalance.mockReset();
		representativeCacheMocks.seedAllStates.mockReset();
		congressionalBalanceServiceMock.fetchCronsCongressBalance.mockResolvedValue(
			undefined,
		);
		representativeCacheMocks.seedAllStates.mockResolvedValue(undefined);
	});

	it('runs the federal balance refresh on its daily cron', async () => {
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
			congressionalBalanceServiceMock.fetchCronsCongressBalance,
		).toHaveBeenCalledOnce();
		expect(representativeCacheMocks.seedAllStates).not.toHaveBeenCalled();
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

		expect(representativeCacheMocks.seedAllStates).toHaveBeenCalledOnce();
		expect(
			congressionalBalanceServiceMock.fetchCronsCongressBalance,
		).not.toHaveBeenCalled();
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
