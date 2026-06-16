// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: API > SERVER.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { match } from 'ts-pattern';
import type { WorkerEnv } from './worker-env';
import { ALLOWED_ORIGINS } from './shared';
import { handleRepresentatives } from './endpoints/representativesEndpoint';
import { seedAllStates } from './representatives-cache/representativesCache';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- /api/* router + CORS. Origin echoed only if allowlisted; OPTIONS preflight short-circuits. ---
const fetch = async (req: Request, env: WorkerEnv): Promise<Response> => {
	const origin = req.headers.get('Origin') ?? '';
	const corsHeaders: Record<string, string> = {
		'access-control-allow-origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
		'access-control-allow-methods': 'GET, POST, OPTIONS',
		'access-control-allow-headers': 'content-type',
		vary: 'Origin',
	};

	if (req.method === 'OPTIONS') {
		const preflight = new Response(null, { status: 204, headers: corsHeaders });

		return preflight;
	}

	const { pathname } = new URL(req.url);
	const response = await match([req.method, pathname] as const)
		.with(['POST', '/api/representatives'], () => handleRepresentatives(req, env))
		.otherwise(() => Promise.resolve(new Response('Not found', { status: 404 })));

	const result = new Response(response.body, response);

	for (const [key, value] of Object.entries(corsHeaders)) {
		result.headers.set(key, value);
	}

	return result;
};

// --- Weekly cron: refresh the federal blob + every state roster in KV. ---
const scheduled = (
	_event: ScheduledController,
	env: WorkerEnv,
	ctx: ExecutionContext,
): void => {
	ctx.waitUntil(seedAllStates(env));
};

const worker: ExportedHandler<WorkerEnv> = { fetch, scheduled };

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// noinspection JSUnusedGlobalSymbols
export default worker;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
