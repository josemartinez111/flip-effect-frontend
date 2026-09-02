// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                         LIB > UTILS > UTILS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Constants as EL } from '../constants/constants';
import {
	MS_PER_DAY,
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
} from '../constants/DateTimeConstants';
import { HTTP_STATUS } from '../constants/HttpStatusConstants';
import type {
	CountDownOptions,
	CountdownTimeLeft,
	DateFormatType,
	SessionExpirationOptions,
} from '../types/DateTimeTypes';
import type { AsyncActionParams, Results } from '../types/TryCatchTypes';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export class Utils {
	static async runTryCatch<TResult>({
		callback,
		errorContext,
		successStatusCode = HTTP_STATUS.OK,
		failureStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
	}: AsyncActionParams<TResult>): Promise<Results<TResult>> {
		try {
			const result: TResult = await callback();
			const succeeded: Results<TResult> = {
				statusCode: successStatusCode,
				result,
			};

			return succeeded;
		} catch (thrown: unknown) {
			// --- A caught value is unknown because JavaScript permits throwing any value. ---
			const normalized: Error =
				thrown instanceof Error
					? thrown
					: new Error(`[${errorContext}] ${String(thrown)}`);

			const failed: Results<TResult> = {
				statusCode: failureStatusCode,
				error: normalized,
			};

			return failed;
		}
	}

	static formatDate(format: DateFormatType, date?: Date | string): string {
		switch (format) {
			case 'year':
				return String(new Date().getFullYear());

			case 'date': {
				if (!date) {
					return EL.STR_EMPTY;
				}

				const parsedDate =
					typeof date === 'string' ? new Date(date) : date;

				if (isNaN(parsedDate.getTime())) {
					return EL.STR_EMPTY;
				}

				return new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}).format(parsedDate);
			}

			case 'long':
			default: {
				if (!date) {
					return EL.STR_EMPTY;
				}

				const parsedDate =
					typeof date === 'string' ? new Date(date) : date;

				if (isNaN(parsedDate.getTime())) {
					return EL.STR_EMPTY;
				}

				return new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
				}).format(parsedDate);
			}
		}
	}

	static getCountdownTimeLeft({
		targetDate,
		nowMs = Date.now(),
	}: CountDownOptions): CountdownTimeLeft {
		const targetMs = new Date(targetDate).getTime();
		const totalMs = Number.isNaN(targetMs)
			? 0
			: Math.max(targetMs - nowMs, 0);
		const result: CountdownTimeLeft = {
			totalMs,
			days: Math.floor(totalMs / MS_PER_DAY),
			hours: Math.floor((totalMs / MS_PER_HOUR) % 24),
			minutes: Math.floor((totalMs / MS_PER_MINUTE) % 60),
			seconds: Math.floor((totalMs / MS_PER_SECOND) % 60),
			isComplete: totalMs === 0,
		};

		return result;
	}

	static formatCountdownUnit(value: number): string {
		return String(value).padStart(2, '0');
	}

	static isSessionExpired(expiresAt: number): boolean {
		return expiresAt <= Math.floor(Date.now() / 1000);
	}

	static getSessionExpiration({
		expiresAt,
		unit,
	}: SessionExpirationOptions): number {
		const now = Math.floor(Date.now() / 1000);

		switch (unit) {
			case 'minutes':
				return now + expiresAt * 60;
			case 'hours':
				return now + expiresAt * 3600;
			default:
				return now + expiresAt;
		}
	}

	static isValidEmail(value: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value);
	}

	static isValidPhoneNumber(value: string): boolean {
		const cleaned = value.replace(/\D/g, '');
		return cleaned.length === 10;
	}

	static formatPhoneNumber(value: string): string {
		const cleaned = value.replace(/\D/g, '');

		if (cleaned.length !== 10) {
			return value;
		}

		const result = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
		return result;
	}

	static isPositiveInteger(value: string | number | undefined): boolean {
		const normalized = String(value).trim();

		if (!normalized) {
			return false;
		}

		const integer = Math.floor(Number(normalized));

		const result =
			integer !== Infinity &&
			String(integer) === normalized &&
			integer >= 0;

		return result;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
