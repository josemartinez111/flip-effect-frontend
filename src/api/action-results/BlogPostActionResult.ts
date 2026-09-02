// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTION_RESULTS
// > BLOG_POST_ACTION_RESULT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type ActionToastData = {
	severity: 'success' | 'info' | 'warn' | 'error';
	summary: string;
	detail: string;
};

export type SharedBlogPostErrorCode =
	| 'NETWORK_ERROR'
	| 'CONFIG_ERROR'
	| 'SERVER_ERROR';

export type BlogPostErrorCode =
	| SharedBlogPostErrorCode
	| 'BLOG_POST_NOT_FOUND';

export type BlogPostActionResult<TData> = {
	success: boolean;
	message?: string;
	data?: TData;
	error?: string;
	errorCode?: BlogPostErrorCode;
};

export const SHARED_BLOG_POST_ERROR_MESSAGES: Record<SharedBlogPostErrorCode, ActionToastData> = {
	NETWORK_ERROR: {
		severity: 'error',
		summary: 'Connection Error',
		detail: 'Could not reach the server. Check your internet connection and try again.',
	},
	CONFIG_ERROR: {
		severity: 'error',
		summary: 'Configuration Error',
		detail: 'A required blog API setting is missing. Contact your administrator.',
	},
	SERVER_ERROR: {
		severity: 'error',
		summary: 'Server Error',
		detail: 'The blog post could not be published. Try again or contact your admin.',
	},
};

export const BLOG_POST_ERROR_MESSAGES: Record<BlogPostErrorCode, ActionToastData> = {
	NETWORK_ERROR: SHARED_BLOG_POST_ERROR_MESSAGES.NETWORK_ERROR,
	CONFIG_ERROR: SHARED_BLOG_POST_ERROR_MESSAGES.CONFIG_ERROR,
	SERVER_ERROR: SHARED_BLOG_POST_ERROR_MESSAGES.SERVER_ERROR,
	BLOG_POST_NOT_FOUND: {
		severity: 'error',
		summary: 'Not Found',
		detail: 'That blog post no longer exists. Refresh the page.',
	},
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
