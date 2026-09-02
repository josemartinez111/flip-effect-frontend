// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > AUTH-SECTIONS > AUTH-PAGE-COMPOSABLES
// > USE_AUTH_UPDATE_PASSWORD_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	getTokensFromFragment,
	SupabaseContext,
	updatePasswordAction,
} from '../../../../api';
import { isAuthMaintenanceMode, type AuthRouteMode, UseSessionStore } from '../../../../lib';
import {
	clearUrlFragment,
	setAuthVerificationSession,
} from './UseAuthVerificationSessionComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type UseAuthUpdatePasswordOptions = {
	authMode: AuthRouteMode;
};

const isValidPassword = (value: string): boolean => value.length >= 8;

export const UseAuthUpdatePasswordComposable = ({
	authMode,
}: UseAuthUpdatePasswordOptions) => {
	const router = useRouter();
	const sessionStore = UseSessionStore();

	const newPassword = ref<string>('');
	const confirmPassword = ref<string>('');
	const newPasswordError = ref<string>('');
	const confirmPasswordError = ref<string>('');
	const showNewPassword = ref<boolean>(false);
	const showConfirmPassword = ref<boolean>(false);
	const isCheckingSession = ref<boolean>(true);
	const isSubmitting = ref<boolean>(false);
	const verifiedEmail = ref<string>('');

	const redirectToAccessDenied = async (): Promise<void> => {
		await router.replace({ name: 'access-denied' });
	};

	const initializePasswordUpdate = async (): Promise<void> => {
		if (isAuthMaintenanceMode(authMode)) {
			isCheckingSession.value = false;
			return;
		}

		const { access_token, refresh_token } = getTokensFromFragment();

		if (!access_token || !refresh_token) {
			isCheckingSession.value = false;
			await redirectToAccessDenied();
			return;
		}

		const supabase = SupabaseContext.getClient();
		const { error: setSessionError } = await supabase.auth.setSession({
			access_token,
			refresh_token,
		});

		if (setSessionError) {
			isCheckingSession.value = false;
			await redirectToAccessDenied();
			return;
		}

		const { data: { session } } = await supabase.auth.getSession();

		if (!session?.user?.email) {
			isCheckingSession.value = false;
			await redirectToAccessDenied();
			return;
		}

		verifiedEmail.value = session.user.email.toLowerCase();
		clearUrlFragment();
		isCheckingSession.value = false;
	};

	const validatePasswordFields = (): boolean => {
		let valid = true;
		newPasswordError.value = '';
		confirmPasswordError.value = '';

		if (!isValidPassword(newPassword.value)) {
			newPasswordError.value = 'Password must be at least 8 characters.';
			valid = false;
		}

		if (confirmPassword.value !== newPassword.value) {
			confirmPasswordError.value = 'Passwords do not match.';
			valid = false;
		}

		return valid;
	};

	const handleUpdatePasswordSubmit = async (): Promise<void> => {
		if (!validatePasswordFields()) {
			return;
		}

		isSubmitting.value = true;
		const result = await updatePasswordAction(newPassword.value);
		isSubmitting.value = false;

		if (!result.success) {
			newPasswordError.value = result.message ?? 'Failed to update password.';
			return;
		}

		if (verifiedEmail.value) {
			setAuthVerificationSession(verifiedEmail.value);
		}

		await SupabaseContext.getClient().auth.signOut();
		sessionStore.clearSession();
		await router.replace({ name: 'admin-login', query: { from: 'update-password' } });
	};

	onMounted(() => {
		void initializePasswordUpdate();
	});

	return {
		newPassword,
		confirmPassword,
		newPasswordError,
		confirmPasswordError,
		showNewPassword,
		showConfirmPassword,
		isCheckingSession,
		isSubmitting,
		handleUpdatePasswordSubmit,
	};
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
