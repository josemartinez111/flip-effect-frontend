// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                 API:UPDATE-PASSWORD-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import { Utils } from '../../../lib';
import { SupabaseContext } from '../../context/supabase-context';

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type UpdatePasswordResultType = {
	success: boolean;
	message?: string;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function updatePasswordAction(
	newPassword: string,
	redirectUrl?: string,
): Promise<UpdatePasswordResultType> {
	const supabase = SupabaseContext.getClient();

	const updatePasswordCallback =
		async (): Promise<UpdatePasswordResultType> => {
			const { error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) {
				return { success: false, message: error.message };
			}

			if (redirectUrl) {
				window.location.assign(redirectUrl);
			}

			return { success: true, message: 'Password updated successfully.' };
		};

	const updatePasswordResults =
		await Utils.runTryCatch<UpdatePasswordResultType>({
			callback: updatePasswordCallback,
			errorContext: 'Error updating password',
		});

	if (updatePasswordResults.error !== undefined) {
		const failed: UpdatePasswordResultType = {
			success: false,
			message: 'Unknown error during password updateRecipients.',
		};

		return failed;
	}

	return updatePasswordResults.result;
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
