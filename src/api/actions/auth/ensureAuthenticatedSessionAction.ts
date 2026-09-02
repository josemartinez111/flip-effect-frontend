// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                  API:VERIFY-MAGIC-LINK-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// ky: A tiny and elegant HTTP client based on the browser Fetch API.
import kyMap from 'ky';
import { GlobalEnvs, Utils } from '../../../lib';
import { SupabaseContext } from '../../context/supabase-context';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type VerifyMagicLinkResultType = {
	success: boolean;
	message?: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function ensureAuthenticatedSessionAction(): Promise<VerifyMagicLinkResultType> {
	// e.g. /api/admin/verify-email
	const verifyMagicLinkApiUrl = GlobalEnvs.VerifyMagicLinkApiUrl;

	const ensureAuthenticatedSessionCallback =
		async (): Promise<VerifyMagicLinkResultType> => {
			if (!verifyMagicLinkApiUrl) {
				return { success: false, message: 'API URL not configured.' };
			}

			const supabase = SupabaseContext.getClient();
			// ---
			// Returns the session, refreshing it if necessary. The session returned
			// can be null if the session is not detected which can happen in the event
			// a user is not signed-in or has logged out.
			// ---
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error || !session?.user?.email) {
				return {
					success: false,
					message: 'No authentication session found.',
				};
			}

			// -- POST email to backend for admin verification --
			const data = await kyMap
				.post(verifyMagicLinkApiUrl, {
					json: { email: session.user.email.toLowerCase() },
				})
				.json<VerifyMagicLinkResultType>();

			return {
				success: !!data?.success,
				message: data?.message ?? 'Admin email check failed.',
			};
		};

	const ensureAuthenticatedSessionResults =
		await Utils.runTryCatch<VerifyMagicLinkResultType>({
			callback: ensureAuthenticatedSessionCallback,
			errorContext: 'Error verifying magic link',
		});

	if (ensureAuthenticatedSessionResults.error !== undefined) {
		const failed: VerifyMagicLinkResultType = {
			success: false,
			message:
				'403 Forbidden: You do not have permission to access this resource.',
		};

		return failed;
	}

	return ensureAuthenticatedSessionResults.result;
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
