// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//   API >> ACTION >> SEND-RESET-PASSWORD-LINK-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { GlobalEnvs, Utils } from '../../../lib';
import type { VerificationLinkResultType } from '../../types/VerificationLinkResultType';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function sendResetPasswordLinkAction(
	email: string,
): Promise<VerificationLinkResultType> {
	// -- Grab API URL from env --
	const resetPasswordLinkApiUrl = GlobalEnvs.ResetPasswordLinkApiUrl;

	const sendResetPasswordLinkCallback =
		async (): Promise<VerificationLinkResultType> => {
			// -- Check email and API URL, basic validation to avoid dumb errors --
			if (!email?.includes('@') || !resetPasswordLinkApiUrl) {
				return {
					success: false,
					message: !email
						? 'Invalid email address.'
						: 'API URL not configured.',
				};
			}

			// -- Build payload, keep it clean with snake_case for backend --
			const payloadReqBody = {
				json: { email },
				headers: {
					'Content-Type': 'application/json',
				},
			};

			// -- Hit the API, pray for 200 OK --
			const data = await kyMap
				.post(resetPasswordLinkApiUrl, payloadReqBody)
				.json<VerificationLinkResultType>();

			// -- Parse response, default message if backend’s feeling lazy --
			const result = {
				success: !!data?.success,
				message: data?.message || 'Reset link sent!',
			};

			return result;
		};

	// -- Wrap in try-catch, don’t let Supabase’s 403 sneak through unhandled --
	const sendResetPasswordLinkResults =
		await Utils.runTryCatch<VerificationLinkResultType>({
			callback: sendResetPasswordLinkCallback,
			errorContext: 'Error sending reset password link',
		});

	if (sendResetPasswordLinkResults.error !== undefined) {
		// -- Fallback for 403, in case Supabase’s still pissed --
		const failed: VerificationLinkResultType = {
			success: false,
			message:
				'403 Forbidden: You do not have permission to access this resource.',
		};

		return failed;
	}

	return sendResetPasswordLinkResults.result;
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
