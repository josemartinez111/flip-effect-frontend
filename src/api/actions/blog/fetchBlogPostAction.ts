// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > BLOG_POST
// > FETCH_BLOG_POST_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import kyMap, { HTTPError } from 'ky';
import { GlobalEnvs } from '../../../lib/constants/GlobalEnvs';
import type {
	BlogPost,
	PublishBlogPostPayload,
} from '../../models/BlogPostModel';
import type {
	BlogPostActionResult,
	BlogPostErrorCode,
} from '../../action-results/BlogPostActionResult';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const resolveBlogPostError = (
	error: unknown,
	errorContext: string,
): BlogPostErrorCode => {
	if (error instanceof HTTPError) {
		console.error(`[ERROR ${errorContext}]: HTTP ${error.response.status}`);
		return error.response.status === 404
			? 'BLOG_POST_NOT_FOUND'
			: 'SERVER_ERROR';
	}

	if (error instanceof Error) {
		console.error(`[ERROR ${errorContext}]: ${error.stack ?? error.message}`);
		return 'NETWORK_ERROR';
	}

	console.error(`[UNKNOWN ERROR ${errorContext}]: ${JSON.stringify(error)}`);
	return 'SERVER_ERROR';
};

export const fetchCurrentBlogPostAction = async (): Promise<BlogPostActionResult<BlogPost>> => {
	const endpoint = GlobalEnvs.BlogCurrentApiUrl;

	if (!endpoint) {
		return { success: false, errorCode: 'CONFIG_ERROR' };
	}

	try {
		return await kyMap.get(endpoint).json<BlogPostActionResult<BlogPost>>();
	} catch (error: unknown) {
		return {
			success: false,
			errorCode: resolveBlogPostError(error, 'FETCH_CURRENT_BLOG_POST_ERROR'),
		};
	}
};

export const fetchPublishBlogPostAction = async (
	payload: PublishBlogPostPayload,
): Promise<BlogPostActionResult<BlogPost>> => {
	const endpoint = GlobalEnvs.BlogPublishApiUrl;

	if (!endpoint) {
		return { success: false, errorCode: 'CONFIG_ERROR' };
	}

	try {
		return await kyMap.post(endpoint, { json: payload }).json<BlogPostActionResult<BlogPost>>();
	} catch (error: unknown) {
		return {
			success: false,
			errorCode: resolveBlogPostError(error, 'FETCH_PUBLISH_BLOG_POST_ERROR'),
		};
	}
};

export const fetchHardRemoveBlogPostAction = async (
	id: string,
): Promise<BlogPostActionResult<void>> => {
	const urlTemplate = GlobalEnvs.BlogHardRemoveApiUrl;

	if (!urlTemplate) {
		return { success: false, errorCode: 'CONFIG_ERROR' };
	}

	const endpoint = urlTemplate.replace('{id}', id);

	try {
		await kyMap.delete(endpoint);
		return { success: true, message: 'Blog post permanently deleted.' };
	} catch (error: unknown) {
		return {
			success: false,
			errorCode: resolveBlogPostError(error, 'FETCH_HARD_REMOVE_BLOG_POST_ERROR'),
		};
	}
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
