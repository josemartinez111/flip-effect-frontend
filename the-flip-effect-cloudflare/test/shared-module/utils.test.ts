// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: TEST > SHARED-MODULE
// > UTILS.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { describe, expect, it } from 'vitest';
import { STATUS } from '@shared-module/httpStatus';
import { Utils } from '@shared-module/utils';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

describe('Utils.APITryCatch', () => {
	it('returns a status-coded API success result', async () => {
		const actionResult = { success: true, message: 'Loaded.' };
		const loadAPIDataCallback = async () => actionResult;

		const result = await Utils.APITryCatch({
			callback: loadAPIDataCallback,
			errorContext: 'LOAD_API_DATA',
		});

		expect(result).toEqual({
			statusCode: STATUS.OK,
			result: actionResult,
		});
	});

	it('returns an existing Error in a status-coded API failure result', async () => {
		const thrown = new Error('Upstream request failed.');
		const loadAPIDataFailureCallback = async (): Promise<void> => {
			throw thrown;
		};

		const result = await Utils.APITryCatch({
			callback: loadAPIDataFailureCallback,
			errorContext: 'LOAD_API_DATA',
			failureStatusCode: STATUS.SERVICE_UNAVAILABLE,
		});

		expect(result).toEqual({
			statusCode: STATUS.SERVICE_UNAVAILABLE,
			error: thrown,
		});
	});

	it('normalizes a non-Error thrown value with its API context', async () => {
		const loadAPIDataPrimitiveFailureCallback =
			async (): Promise<void> => {
				throw 'offline';
			};

		const result = await Utils.APITryCatch({
			callback: loadAPIDataPrimitiveFailureCallback,
			errorContext: 'LOAD_API_DATA',
		});

		expect(result).toEqual({
			statusCode: STATUS.INTERNAL_SERVER_ERROR,
			error: new Error('[LOAD_API_DATA] offline'),
		});
	});

	it('distinguishes valid undefined API data from a failure', async () => {
		const voidAPIActionCallback = async (): Promise<undefined> =>
			undefined;

		const result = await Utils.APITryCatch({
			callback: voidAPIActionCallback,
			errorContext: 'VOID_API_ACTION',
		});

		expect(result).toEqual({
			statusCode: STATUS.OK,
			result: undefined,
		});
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
