// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > AUTH-SECTIONS > AUTH-PAGE-COMPOSABLES
// > USE_AUTH_VERIFICATION_LINK_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref } from 'vue';
import type { VerificationLinkResultType } from '../../../../api';
import { Utils } from '../../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type AuthLinkStatus = 'idle' | 'loading' | 'sent' | 'error';

type UseAuthVerificationLinkOptions = {
	sendLinkCallback: (email: string) => Promise<VerificationLinkResultType>;
	successMessage?: string;
	errorMessage?: string;
};

export const UseAuthVerificationLinkComposable = ({
	sendLinkCallback,
	successMessage,
	errorMessage,
}: UseAuthVerificationLinkOptions) => {
	const email = ref<string>('');
	const status = ref<AuthLinkStatus>('idle');
	const message = ref<string>('');

	const resetMessage = (): void => {
		message.value = '';
		status.value = 'idle';
	};

	const handleInput = (): void => {
		resetMessage();
	};

	const handleSendLink = async (): Promise<void> => {
		status.value = 'loading';
		message.value = '';
		const sendVerificationLinkCallback =
			(): Promise<VerificationLinkResultType> =>
				sendLinkCallback(email.value);

		const sendVerificationLinkResults =
			await Utils.runTryCatch<VerificationLinkResultType>({
				callback: sendVerificationLinkCallback,
				errorContext: 'SEND_AUTH_LINK',
			});

		if (sendVerificationLinkResults.error !== undefined) {
			status.value = 'error';
			message.value =
				errorMessage ?? 'An error occurred while sending the link.';

			return;
		}

		if (sendVerificationLinkResults.result.success) {
			status.value = 'sent';
			message.value =
				sendVerificationLinkResults.result.message ??
				successMessage ??
				'Link sent.';

			return;
		}

		status.value = 'error';
		message.value =
			sendVerificationLinkResults.result.message ??
			errorMessage ??
			'An error occurred while sending the link.';
	};

	return {
		email,
		status,
		message,
		handleInput,
		handleSendLink,
	};
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
