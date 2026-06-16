// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > CIVIC_REPRESENTATIVES
// > FETCH_CIVIC_REPRESENTATIVES_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import kyMap from 'ky';
import { GlobalEnvs, ST, tryCatchHandler } from '../../../lib';
import type { CivicRepresentativeActionResult } from '../../action-results/CivicRepresentativeActionResult';
import type { CivicRepresentativeSearchParams } from '../../models/CivicRepresentativeModel';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Thin POST to the Cloudflare Worker, which owns the 3 civic sources + the Open States key.
// The Worker already returns the exact CivicRepresentativeActionResult shape (incl. 400/404).
// ---
export async function fetchCivicRepresentativesAction(
	searchParams: CivicRepresentativeSearchParams,
): Promise<CivicRepresentativeActionResult> {
	// --- The actual request, handed to tryCatchHandler so failures are caught, not thrown. ---
	const fetchCivicRepresentativesRequest =
		async (): Promise<CivicRepresentativeActionResult> => {
			// --- Trim any trailing slash so the path joins cleanly across local/prod origins. ---
			const workerUrl = GlobalEnvs.CivicWorkerUrl.replace(/\/+$/, '');

			const responseOptions = {
				json: searchParams,
				throwHttpErrors: false,
			};

			// --- throwHttpErrors:false → the Worker's own 400/404 bodies come back as results, not exceptions. ---
			const response = await kyMap.post(
				`${workerUrl}/api/representatives`,
				responseOptions,
			);

			// --- Worker JSON already matches CivicRepresentativeActionResult, so the UI never sees raw shapes. ---
			const actionResult = await response.json<CivicRepresentativeActionResult>();

			// --- A clean non-2xx isn't thrown, so surface it here: action message + upstream cause, side by side. ---
			if (!actionResult.success) {
				console.error(
					`[civic-representatives ${actionResult.statusCode}] ${actionResult.message}${actionResult.error ? ` | ${actionResult.error}` : ''}`,
				);
			}

			return actionResult;
		};

	// --- tryCatchHandler logs and returns undefined on a real failure (network down, bad JSON). ---
	const result = await tryCatchHandler<CivicRepresentativeActionResult>({
		asyncActionCallback: fetchCivicRepresentativesRequest,
		errorContext: 'Error loading civic representatives',
	});

	// --- undefined only happens on that hard failure, so fall back to a 500 the UI can render. ---
	const civicRepresentativesResult: CivicRepresentativeActionResult = result ?? {
			success: false,
			statusCode: ST.INTERNAL_SERVER_ERROR,
			message: 'Representative lookup failed.',
		};

	return civicRepresentativesResult;
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
