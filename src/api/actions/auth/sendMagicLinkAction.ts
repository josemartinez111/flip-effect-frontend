// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//       API >> ACTION  >> SEND-MAGIC-LINK-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { GlobalEnvs, Utils } from '../../../lib';
import type { VerificationLinkResultType } from '../../types/VerificationLinkResultType';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function sendMagicLinkAction(
	email: string,
): Promise<VerificationLinkResultType> {
	const magicLinkApiUrl = GlobalEnvs.MagicLinkApiUrl;

	const sendMagicLinkCallback =
		async (): Promise<VerificationLinkResultType> => {
			if (!email?.includes('@') || !magicLinkApiUrl) {
				return {
					success: false,
					message: !email
						? 'Invalid email address.'
						: 'API URL not configured.',
				};
			}

			const payloadReqBody = {
				json: {
					email,
				},
			};

			const data = await kyMap
				.post(magicLinkApiUrl, payloadReqBody)
				.json<VerificationLinkResultType>();

			const result = {
				success: !!data?.success,
				message: data?.message || 'Magic link sent!',
			};

			return result;
		};

	const sendMagicLinkResults =
		await Utils.runTryCatch<VerificationLinkResultType>({
			callback: sendMagicLinkCallback,
			errorContext: 'Error sending magic link',
		});

	if (sendMagicLinkResults.error !== undefined) {
		const failed: VerificationLinkResultType = {
			success: false,
			message:
				'403 Forbidden: You do not have permission to access this resource.',
		};

		return failed;
	}

	return sendMagicLinkResults.result;
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
