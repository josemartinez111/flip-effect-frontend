// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > REPRESENTATIVES-MODULE > PRESENTATION
// > REPRESENTATIVES_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { Hono } from 'hono';
import { createFactory } from 'hono/factory';
import type { WorkerHonoEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import type {
	CivicRepresentativeActionResult,
	CivicRepresentativeSearchParams,
} from '@representatives-module/domain/representativeModel';
import { fetchRepresentativesBySearch } from '@representatives-module/application/representativesService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Typed handler factory bound to the Worker env (extracted handlers, never inlined at the route). ---
const workerFactory = createFactory<WorkerHonoEnv>();

// --- POST /api/representatives → normalized CivicRepresentativeActionResult JSON. ---
const representativeHandlers = workerFactory.createHandlers(async (ctx) => {
	let searchParams: CivicRepresentativeSearchParams;

	try {
		searchParams = await ctx.req.json<CivicRepresentativeSearchParams>();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		const invalid: CivicRepresentativeActionResult = {
			success: false,
			statusCode: STATUS.BAD_REQUEST,
			message: 'Invalid request body.',
		};
		// --- RETURNS ERROR JSON --- 
		return ctx.json(invalid, invalid.statusCode);
	}

	const result = await fetchRepresentativesBySearch(ctx.env, searchParams);
	
	
	return ctx.json(
		result, 
		result.statusCode
	);
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// --- Route group (declared here like a .NET endpoint class; mounted under /api in app.ts). ---
const representativeRoutes = new Hono<WorkerHonoEnv>();
representativeRoutes.post('/representatives', ...representativeHandlers);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
export { representativeRoutes };
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
