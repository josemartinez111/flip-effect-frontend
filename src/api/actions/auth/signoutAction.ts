//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                  API >> ACTIONS >> SIGNOUT-ACTION.TS
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { GlobalEnvs, Utils } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type SignOutActionResult = {
	success: boolean;
	message?: string;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function signoutAction(): Promise<SignOutActionResult> {
	const signOutApiUrl = GlobalEnvs.SignOutApiUrl;

	const signOutCallback = async (): Promise<SignOutActionResult> => {
		if (!signOutApiUrl) {
			return {
				success: false,
				message: 'Sign-out API URL not configured.',
			};
		}

		const response = await kyMap
			.post(signOutApiUrl)
			.json<SignOutActionResult>();

		switch (true) {
			case response.success:
				return response;
			default:
				return {
					success: false,
					message: response.message || 'Sign-out failed.',
				};
		}
	};

	const signOutResults = await Utils.runTryCatch<SignOutActionResult>({
		callback: signOutCallback,
		errorContext: 'Error during admin sign out',
	});

	if (signOutResults.error !== undefined) {
		const failed: SignOutActionResult = {
			success: false,
			message: 'Sign out failed: Unknown error.',
		};

		return failed;
	}

	return signOutResults.result;
}

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
