// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > AUTH-SECTIONS > AUTH-PAGE-COMPOSABLES
// > USE_AUTH_LOGIN_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	ensureAuthenticatedSessionAction,
	getTokensFromFragment,
	SupabaseContext,
} from '../../../../api';
import {
	isAuthMaintenanceMode,
	type AuthRouteMode,
	UseSessionStore,
	Utils,
} from '../../../../lib';
import {
	clearAuthVerificationSession,
	clearUrlFragment,
	getAuthVerificationSession,
	setAuthVerificationSession,
} from './UseAuthVerificationSessionComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type UseAuthLoginOptions = {
	authMode: AuthRouteMode;
	redirectAfterLogin?: string;
};

const DEFAULT_REDIRECT_PATH = '/blog';

const isValidPassword = (value: string): boolean => value.length >= 8;

export const UseAuthLoginComposable = ({
	authMode,
	redirectAfterLogin = DEFAULT_REDIRECT_PATH,
}: UseAuthLoginOptions) => {
	const router = useRouter();
	const route = useRoute();
	const sessionStore = UseSessionStore();

	const email = ref<string>('');
	const password = ref<string>('');
	const emailError = ref<string>('');
	const passwordError = ref<string>('');
	const isCheckingAuth = ref<boolean>(true);
	const isSubmitting = ref<boolean>(false);
	const showPassword = ref<boolean>(false);
	const showPasswordReset = ref<boolean>(false);
	const verifiedIdentityEmail = ref<string>('');

	const fromPasswordUpdate = computed(() => (
		route.query.from === 'update-password'
	));

	const loginIntroText = computed(() => (
		fromPasswordUpdate.value
			? 'Your password was updated. Log in with your new credentials.'
			: 'Enter your credentials to access the admin area.'
	));

	const redirectTarget = computed(() => {
		const queryRedirect = route.query.redirect;

		if (typeof queryRedirect === 'string' && queryRedirect.startsWith('/')) {
			return queryRedirect;
		}

		return redirectAfterLogin;
	});

	const clearFormErrors = (): void => {
		emailError.value = '';
		passwordError.value = '';
	};

	const hydrateExistingVerification = (): boolean => {
		const verificationSession = getAuthVerificationSession();

		if (!verificationSession) {
			return false;
		}

		verifiedIdentityEmail.value = verificationSession.email;
		email.value = verificationSession.email;

		return true;
	};

	const redirectToAccessDenied = async (): Promise<void> => {
		await router.replace({ name: 'access-denied' });
	};

	const processMagicLinkTokens = async (): Promise<void> => {
		const { access_token, refresh_token } = getTokensFromFragment();

		if (!access_token || !refresh_token) {
			return;
		}

		const supabase = SupabaseContext.getClient();
		const { error: setSessionError } = await supabase.auth.setSession({
			access_token,
			refresh_token,
		});

		if (setSessionError) {
			await redirectToAccessDenied();
			return;
		}

		const { data: { session } } = await supabase.auth.getSession();
		const verifiedEmail = session?.user?.email?.toLowerCase() ?? '';
		const result = await ensureAuthenticatedSessionAction();

		await supabase.auth.signOut();

		if (!result.success || !verifiedEmail) {
			await redirectToAccessDenied();
			return;
		}

		const verificationSession = setAuthVerificationSession(verifiedEmail);
		verifiedIdentityEmail.value = verificationSession?.email ?? verifiedEmail;
		email.value = verifiedIdentityEmail.value;
		clearUrlFragment();
	};

	const initializeAuthLogin = async (): Promise<void> => {
		if (isAuthMaintenanceMode(authMode)) {
			isCheckingAuth.value = false;
			return;
		}

		const { access_token, refresh_token } = getTokensFromFragment();

		if (access_token && refresh_token) {
			await processMagicLinkTokens();
			isCheckingAuth.value = false;
			return;
		}

		hydrateExistingVerification();
		isCheckingAuth.value = false;
	};

	const handleLoginSubmit = async (): Promise<void> => {
		clearFormErrors();

		let valid = true;

		if (!Utils.isValidEmail(email.value)) {
			emailError.value = 'Please enter a valid email address.';
			valid = false;
		}

		if (!isValidPassword(password.value)) {
			passwordError.value = 'Password must be at least 8 characters.';
			valid = false;
		}

		if (!valid) {
			return;
		}

		isSubmitting.value = true;
		const result = await sessionStore.login(email.value.trim().toLowerCase(), password.value);
		isSubmitting.value = false;

		if (!result.success) {
			emailError.value = result.message ?? 'Login failed.';
			return;
		}

		clearAuthVerificationSession();
		password.value = '';
		await router.push(redirectTarget.value);
	};

	const goHome = async (): Promise<void> => {
		await router.push('/');
	};

	onMounted(() => {
		void initializeAuthLogin();
	});

	return {
		email,
		password,
		emailError,
		passwordError,
		isCheckingAuth,
		isSubmitting,
		showPassword,
		showPasswordReset,
		verifiedIdentityEmail,
		loginIntroText,
		clearFormErrors,
		handleLoginSubmit,
		goHome,
	};
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
