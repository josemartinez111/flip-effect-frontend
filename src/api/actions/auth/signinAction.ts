//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                 API >> ACTIONS >> SIGNIN-ACTION.TS
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { GlobalEnvs, Utils } from '../../../lib';
import type { Session, AuthError } from '@supabase/supabase-js';
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type SignInActionResultType = {
	success: boolean;
	message?: string;
	session?: Session;
	error?: AuthError;
};

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function signinAction(
	email: string,
	password: string,
): Promise<SignInActionResultType> {
	const signInApiUrl = GlobalEnvs.SignInApiUrl;

	const signInCallback = async (): Promise<SignInActionResultType> => {
		if (!signInApiUrl) {
			return {
				success: false,
				message: 'Sign-in API URL not configured.',
			};
		}

		const payloadBody = {
			json: { email, password },
		};
		const response = await kyMap
			.post(signInApiUrl, payloadBody)
			.json<SignInActionResultType>();

		// Adapt structure if your API returns differently
		switch (true) {
			case response.success:
				return response;
			default:
				return {
					success: false,
					message: response.message || 'Sign-in failed.',
				};
		}
	};

	const signInResults = await Utils.runTryCatch<SignInActionResultType>({
		callback: signInCallback,
		errorContext: 'Error during admin sign in',
	});

	if (signInResults.error !== undefined) {
		const failed: SignInActionResultType = {
			success: false,
			message: 'Sign in failed: Unknown error.',
		};

		return failed;
	}

	return signInResults.result;
}

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
