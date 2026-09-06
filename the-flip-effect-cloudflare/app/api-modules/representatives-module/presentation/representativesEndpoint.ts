// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > PRESENTATION
// > REPRESENTATIVES_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import { Utils } from '@shared-module/utils';
import type {
	CivicRepresentativeActionResult,
	CivicRepresentativeSearchParams,
} from '@representatives-module/domain/representativeModel';
import { RepresentativesService } from '@representatives-module/application/representativesService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Own the representative route group and private handler like the Elysia endpoint classes. ---
export class RepresentativesEndpoints {
	static mappedRepresentativesRoutes(): Hono<WorkerHonoEnv> {
		const representativeRoutes = new Hono<WorkerHonoEnv>();
		representativeRoutes.post(
			'/representatives',
			RepresentativesEndpoints.fetchRepresentativesBySearchAsync,
		);

		return representativeRoutes;
	}

	// --- POST /api/representatives → normalized CivicRepresentativeActionResult JSON. ---
	private static async fetchRepresentativesBySearchAsync(
		ctx: Context<WorkerHonoEnv>,
	): Promise<Response> {
		const fetchRepresentativeSearchParamsCallback =
			async (): Promise<CivicRepresentativeSearchParams> =>
				ctx.req.json<CivicRepresentativeSearchParams>();
		const searchParamsResults =
			await Utils.APITryCatch<CivicRepresentativeSearchParams>({
				callback: fetchRepresentativeSearchParamsCallback,
				errorContext: 'FETCH_REPRESENTATIVE_SEARCH_PARAMS',
				failureStatusCode: STATUS.BAD_REQUEST,
			});

		if (searchParamsResults.error !== undefined) {
			console.error(searchParamsResults.error.message);

			const invalid: CivicRepresentativeActionResult = {
				success: false,
				statusCode: searchParamsResults.statusCode,
				message: 'Invalid request body.',
			};

			const response = ctx.json(invalid, invalid.statusCode);
			return response;
		}

		const result =
			await RepresentativesService.fetchRepresentativesBySearch(
				ctx.env,
				searchParamsResults.result,
			);

		const response = ctx.json(result, result.statusCode);
		return response;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
