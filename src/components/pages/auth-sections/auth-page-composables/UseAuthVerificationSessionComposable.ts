// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > AUTH-SECTIONS > AUTH-PAGE-COMPOSABLES
// > USE_AUTH_VERIFICATION_SESSION_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type AuthVerificationSession = {
	email: string;
	expiresAt: number;
};

const AUTH_VERIFICATION_SESSION_KEY = 'appAuthVerification';
const AUTH_VERIFICATION_TTL_SECONDS = 10 * 60;

const nowInEpochSeconds = (): number => Math.floor(Date.now() / 1000);

const hasBrowserStorage = (): boolean => (
	typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
);

export const clearAuthVerificationSession = (): void => {
	if (!hasBrowserStorage()) {
		return;
	}

	window.sessionStorage.removeItem(AUTH_VERIFICATION_SESSION_KEY);
};

export const getAuthVerificationSession = (): AuthVerificationSession | null => {
	if (!hasBrowserStorage()) {
		return null;
	}

	const sessionRaw = window.sessionStorage.getItem(AUTH_VERIFICATION_SESSION_KEY);

	if (!sessionRaw) {
		return null;
	}

	try {
		const session = JSON.parse(sessionRaw) as AuthVerificationSession;
		const isValidSession = Boolean(session.email) && session.expiresAt > nowInEpochSeconds();

		if (!isValidSession) {
			clearAuthVerificationSession();
			return null;
		}

		return session;
	} catch {
		clearAuthVerificationSession();
		return null;
	}
};

export const setAuthVerificationSession = (email: string): AuthVerificationSession | null => {
	if (!hasBrowserStorage() || !email) {
		return null;
	}

	const session: AuthVerificationSession = {
		email: email.trim().toLowerCase(),
		expiresAt: nowInEpochSeconds() + AUTH_VERIFICATION_TTL_SECONDS,
	};

	window.sessionStorage.setItem(
		AUTH_VERIFICATION_SESSION_KEY,
		JSON.stringify(session),
	);

	return session;
};

export const clearUrlFragment = (): void => {
	if (typeof window === 'undefined') {
		return;
	}

	window.history.replaceState(
		window.history.state,
		document.title,
		`${window.location.pathname}${window.location.search}`,
	);
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
