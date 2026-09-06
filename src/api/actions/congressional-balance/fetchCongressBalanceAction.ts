// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > CONGRESSIONAL-BALANCE
// > FETCH_CONGRESSIONAL_BALANCE_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import kyMap from 'ky';
import { GlobalEnvs, ST, Utils } from '../../../lib';
import type { CongressBalanceActionResult } from '../../action-results/CongressBalanceActionResult.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Fetch only the compact KV-backed Worker result; the browser never downloads the full roster. ---
export const fetchCongressBalanceAction =
	async (): Promise<CongressBalanceActionResult> => {
		const fetchCongressBalanceCallback =
			async (): Promise<CongressBalanceActionResult> => {
				const workerUrl = GlobalEnvs.CivicWorkerUrl.replace(/\/+$/, '');
				const response = await kyMap.get(
					`${workerUrl}/api/congressional-balance`,
					{ throwHttpErrors: false },
				);
				const actionResult =
					await response.json<CongressBalanceActionResult>();

				if (!actionResult.success) {
					console.error(
						`[congressional balance ${actionResult.statusCode}] ${actionResult.message} | ${actionResult.error}`,
					);
				}

				return actionResult;
			};

		const balanceResults =
			await Utils.runTryCatch<CongressBalanceActionResult>({
				callback: fetchCongressBalanceCallback,
				errorContext: 'Error loading congressional balance',
			});

		if (balanceResults.error !== undefined) {
			const failed: CongressBalanceActionResult = {
				success: false,
				statusCode: ST.INTERNAL_SERVER_ERROR,
				message: 'Congressional balance lookup failed.',
				error: balanceResults.error.message,
			};

			return failed;
		}

		return balanceResults.result;
	};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
