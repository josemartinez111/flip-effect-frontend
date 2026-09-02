// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > SHARED-MODULE > UTILS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { STATUS } from '@shared-module/httpStatus';
import type {
	AsyncAPIActionParams,
	Results,
} from '@shared-module/apiTryCatchTypes';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export class Utils {
	static async APITryCatch<TAPIResult>({
		callback,
		errorContext,
		successStatusCode = STATUS.OK,
		failureStatusCode = STATUS.INTERNAL_SERVER_ERROR,
	}: AsyncAPIActionParams<TAPIResult>): Promise<Results<TAPIResult>> {
		try {
			const result: TAPIResult = await callback();
			const succeeded: Results<TAPIResult> = {
				statusCode: successStatusCode,
				result,
			};

			return succeeded;
		} catch (thrown: unknown) {
			// --- A caught value is unknown because JavaScript permits throwing any value. ---
			const normalized: Error =
				thrown instanceof Error
					? thrown
					: new Error(`[${errorContext}] ${String(thrown)}`);

			const failed: Results<TAPIResult> = {
				statusCode: failureStatusCode,
				error: normalized,
			};

			return failed;
		}
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
