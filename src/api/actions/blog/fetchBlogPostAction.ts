// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > BLOG_POST
// > FETCH_BLOG_POST_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import kyMap, { HTTPError } from 'ky';
import { GlobalEnvs } from '../../../lib/constants/GlobalEnvs';
import { Utils } from '../../../lib/utils/utils';
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
		console.error(
			`[ERROR ${errorContext}]: HTTP ${error.response.status}`,
		);
		return error.response.status === 404
			? 'BLOG_POST_NOT_FOUND'
			: 'SERVER_ERROR';
	}

	if (error instanceof Error) {
		console.error(
			`[ERROR ${errorContext}]: ${error.stack ?? error.message}`,
		);
		return 'NETWORK_ERROR';
	}

	console.error(
		`[UNKNOWN ERROR ${errorContext}]: ${JSON.stringify(error)}`,
	);
	return 'SERVER_ERROR';
};

export const fetchCurrentBlogPostAction = async (): Promise<
	BlogPostActionResult<BlogPost>
> => {
	const endpoint = GlobalEnvs.BlogCurrentApiUrl;

	if (!endpoint) {
		const failed: BlogPostActionResult<BlogPost> = {
			success: false,
			errorCode: 'CONFIG_ERROR',
		};

		return failed;
	}

	const fetchCurrentBlogPostCallback = async (): Promise<
		BlogPostActionResult<BlogPost>
	> => kyMap.get(endpoint).json<BlogPostActionResult<BlogPost>>();
	const blogPostResults = await Utils.runTryCatch({
		callback: fetchCurrentBlogPostCallback,
		errorContext: 'FETCH_CURRENT_BLOG_POST',
	});

	if (blogPostResults.error !== undefined) {
		const failed: BlogPostActionResult<BlogPost> = {
			success: false,
			errorCode: resolveBlogPostError(
				blogPostResults.error,
				'FETCH_CURRENT_BLOG_POST_ERROR',
			),
		};

		return failed;
	}

	return blogPostResults.result;
};

export const fetchPublishBlogPostAction = async (
	payload: PublishBlogPostPayload,
): Promise<BlogPostActionResult<BlogPost>> => {
	const endpoint = GlobalEnvs.BlogPublishApiUrl;

	if (!endpoint) {
		const failed: BlogPostActionResult<BlogPost> = {
			success: false,
			errorCode: 'CONFIG_ERROR',
		};

		return failed;
	}

	const fetchPublishBlogPostCallback = async (): Promise<
		BlogPostActionResult<BlogPost>
	> =>
		kyMap
			.post(endpoint, { json: payload })
			.json<BlogPostActionResult<BlogPost>>();
	const publishResults = await Utils.runTryCatch({
		callback: fetchPublishBlogPostCallback,
		errorContext: 'FETCH_PUBLISH_BLOG_POST',
	});

	if (publishResults.error !== undefined) {
		const failed: BlogPostActionResult<BlogPost> = {
			success: false,
			errorCode: resolveBlogPostError(
				publishResults.error,
				'FETCH_PUBLISH_BLOG_POST_ERROR',
			),
		};

		return failed;
	}

	return publishResults.result;
};

export const fetchHardRemoveBlogPostAction = async (
	id: string,
): Promise<BlogPostActionResult<void>> => {
	const urlTemplate = GlobalEnvs.BlogHardRemoveApiUrl;

	if (!urlTemplate) {
		const failed: BlogPostActionResult<void> = {
			success: false,
			errorCode: 'CONFIG_ERROR',
		};

		return failed;
	}

	const endpoint = urlTemplate.replace('{id}', id);
	const fetchHardRemoveBlogPostCallback = async (): Promise<void> => {
		await kyMap.delete(endpoint);
	};
	const removeResults = await Utils.runTryCatch({
		callback: fetchHardRemoveBlogPostCallback,
		errorContext: 'FETCH_HARD_REMOVE_BLOG_POST',
	});

	if (removeResults.error !== undefined) {
		const failed: BlogPostActionResult<void> = {
			success: false,
			errorCode: resolveBlogPostError(
				removeResults.error,
				'FETCH_HARD_REMOVE_BLOG_POST_ERROR',
			),
		};

		return failed;
	}

	const succeeded: BlogPostActionResult<void> = {
		success: true,
		message: 'Blog post permanently deleted.',
	};

	return succeeded;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
