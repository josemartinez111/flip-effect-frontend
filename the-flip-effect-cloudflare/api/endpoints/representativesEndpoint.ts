// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: API > ENDPOINTS
// > REPRESENTATIVES_ENDPOINT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { WorkerEnv } from '../worker-env';
import type { CivicRepresentativeSearchParams } from '../shared';
import { STATUS } from '../shared';
import { resolveRepresentatives } from '../services/representativesService';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- POST /api/representatives → normalized CivicRepresentativeActionResult JSON. ---
export const handleRepresentatives = async (
	req: Request,
	env: WorkerEnv,
): Promise<Response> => {
	let searchParams: CivicRepresentativeSearchParams;

	try {
		searchParams = await req.json();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		return new Response(
			JSON.stringify({
				success: false,
				statusCode: STATUS.BAD_REQUEST,
				message: 'Invalid request body.',
			}),
			{
				status: STATUS.BAD_REQUEST,
				headers: { 'content-type': 'application/json' },
			},
		);
	}

	const result = await resolveRepresentatives(env, searchParams);

	return new Response(JSON.stringify(result), {
		status: result.statusCode,
		headers: { 'content-type': 'application/json' },
	});
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
