// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > UTILS > AUTH_VERIFICATION_SESSION_UTILS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { AuthVerificationSession } from '../types/AuthVerificationSessionTypes';
import { Utils } from './utils';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export class AuthVerificationSessionUtils {
	private static readonly SESSION_KEY = 'appAuthVerification';
	private static readonly SESSION_TTL_SECONDS = 10 * 60;

	private static fetchNowInEpochSeconds(): number {
		return Math.floor(Date.now() / 1000);
	}

	private static hasBrowserStorage(): boolean {
		return (
			typeof window !== 'undefined' &&
			typeof window.sessionStorage !== 'undefined'
		);
	}

	static clearVerificationSession(): void {
		if (!AuthVerificationSessionUtils.hasBrowserStorage()) {
			return;
		}

		window.sessionStorage.removeItem(
			AuthVerificationSessionUtils.SESSION_KEY,
		);
	}

	static fetchVerificationSession(): AuthVerificationSession | null {
		if (!AuthVerificationSessionUtils.hasBrowserStorage()) {
			return null;
		}

		const sessionRaw = window.sessionStorage.getItem(
			AuthVerificationSessionUtils.SESSION_KEY,
		);

		if (!sessionRaw) {
			return null;
		}

		const parseVerificationSessionCallback = (): unknown =>
			JSON.parse(sessionRaw);
		const sessionResults = Utils.runTryCatchSync({
			callback: parseVerificationSessionCallback,
			errorContext: 'PARSE_AUTH_VERIFICATION_SESSION',
		});

		if (sessionResults.error !== undefined) {
			AuthVerificationSessionUtils.clearVerificationSession();

			return null;
		}

		const parsedSession = sessionResults.result;

		if (
			typeof parsedSession !== 'object' ||
			parsedSession === null ||
			!('email' in parsedSession) ||
			!('expiresAt' in parsedSession) ||
			typeof parsedSession.email !== 'string' ||
			typeof parsedSession.expiresAt !== 'number'
		) {
			AuthVerificationSessionUtils.clearVerificationSession();

			return null;
		}

		const session: AuthVerificationSession = {
			email: parsedSession.email,
			expiresAt: parsedSession.expiresAt,
		};
		const isValidSession =
			Boolean(session.email) &&
			session.expiresAt >
				AuthVerificationSessionUtils.fetchNowInEpochSeconds();

		if (!isValidSession) {
			AuthVerificationSessionUtils.clearVerificationSession();

			return null;
		}

		return session;
	}

	static saveVerificationSession(
		email: string,
	): AuthVerificationSession | null {
		if (!AuthVerificationSessionUtils.hasBrowserStorage() || !email) {
			return null;
		}

		const session: AuthVerificationSession = {
			email: email.trim().toLowerCase(),
			expiresAt:
				AuthVerificationSessionUtils.fetchNowInEpochSeconds() +
				AuthVerificationSessionUtils.SESSION_TTL_SECONDS,
		};

		window.sessionStorage.setItem(
			AuthVerificationSessionUtils.SESSION_KEY,
			JSON.stringify(session),
		);

		return session;
	}

	static clearUrlFragment(): void {
		if (typeof window === 'undefined') {
			return;
		}

		window.history.replaceState(
			window.history.state,
			document.title,
			`${window.location.pathname}${window.location.search}`,
		);
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
