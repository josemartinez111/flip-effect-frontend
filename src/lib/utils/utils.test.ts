// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                         LIB > UTILS > UTILS.TEST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS as ST } from '../constants/HttpStatusConstants';
import { Utils } from './utils';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

afterEach(() => {
	vi.useRealTimers();
});

describe('Utils.runTryCatch', () => {
	it('returns a status-coded success result', async () => {
		const actionResult = { success: true, message: 'Loaded.' };
		const loadDataCallback = async () => actionResult;

		const result = await Utils.runTryCatch({
			callback: loadDataCallback,
			errorContext: 'LOAD_DATA',
		});

		expect(result).toEqual({
			statusCode: ST.OK,
			result: actionResult,
		});
	});

	it('returns an existing Error in a status-coded failure result', async () => {
		const thrown = new Error('Request failed.');
		const loadDataFailureCallback = async (): Promise<void> => {
			throw thrown;
		};

		const result = await Utils.runTryCatch({
			callback: loadDataFailureCallback,
			errorContext: 'LOAD_DATA',
			failureStatusCode: ST.SERVICE_UNAVAILABLE,
		});

		expect(result).toEqual({
			statusCode: ST.SERVICE_UNAVAILABLE,
			error: thrown,
		});
	});

	it('normalizes a non-Error thrown value with its context', async () => {
		const loadDataPrimitiveFailureCallback = async (): Promise<void> => {
			throw 'offline';
		};

		const result = await Utils.runTryCatch({
			callback: loadDataPrimitiveFailureCallback,
			errorContext: 'LOAD_DATA',
		});

		expect(result).toEqual({
			statusCode: ST.INTERNAL_SERVER_ERROR,
			error: new Error('[LOAD_DATA] offline'),
		});
	});

	it('distinguishes valid undefined data from a failure', async () => {
		const voidActionCallback = async (): Promise<undefined> => undefined;

		const result = await Utils.runTryCatch({
			callback: voidActionCallback,
			errorContext: 'VOID_ACTION',
		});

		expect(result).toEqual({
			statusCode: ST.OK,
			result: undefined,
		});
	});
});

describe('general utilities', () => {
	it('calculates and formats a deterministic countdown', () => {
		const result = Utils.getCountdownTimeLeft({
			targetDate: new Date(90_061_000),
			nowMs: 0,
		});

		expect(result).toEqual({
			totalMs: 90_061_000,
			days: 1,
			hours: 1,
			minutes: 1,
			seconds: 1,
			isComplete: false,
		});
		expect(Utils.formatCountdownUnit(7)).toBe('07');
	});

	it('formats supported date values', () => {
		expect(Utils.formatDate('year')).toBe(
			String(new Date().getFullYear()),
		);
		expect(Utils.formatDate('long', 'not-a-date')).toBe('');
	});

	it('calculates and checks session expiration', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

		const expiresAt = Utils.getSessionExpiration({
			expiresAt: 24,
			unit: 'hours',
		});

		expect(expiresAt).toBe(1_767_312_000);
		expect(Utils.isSessionExpired(expiresAt)).toBe(false);
		expect(Utils.isSessionExpired(1_767_225_599)).toBe(true);
	});

	it('validates and formats general input values', () => {
		expect(Utils.isValidEmail('sin@example.com')).toBe(true);
		expect(Utils.isValidEmail('not-an-email')).toBe(false);
		expect(Utils.isValidPhoneNumber('(555) 123-4567')).toBe(true);
		expect(Utils.formatPhoneNumber('(555) 123-4567')).toBe('555-123-4567');
		expect(Utils.isPositiveInteger(0)).toBe(true);
		expect(Utils.isPositiveInteger(-1)).toBe(false);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
