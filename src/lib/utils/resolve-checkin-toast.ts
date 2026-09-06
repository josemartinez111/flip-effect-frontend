// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB: UTILS
// > RESOLVE_CHECKIN_TOAST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type {
	ActionToastData,
	BlogPostErrorCode,
	SharedBlogPostErrorCode,
} from '../../api/action-results/BlogPostActionResult';
import {
	BLOG_POST_ERROR_MESSAGES,
	SHARED_BLOG_POST_ERROR_MESSAGES,
} from '../../api/action-results/BlogPostActionResult';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CheckInToastResult = {
	severity: 'warn' | 'error';
	summary: string;
};

export const resolveCheckInToast = (message: string | undefined): CheckInToastResult => {
	if (/already|checked.?in/i.test(message ?? '')) {
		return { severity: 'warn', summary: 'Already Checked In' };
	}
	return { severity: 'error', summary: 'Check-in failed' };
};

export type {
	ActionToastData,
	BlogPostErrorCode,
	SharedBlogPostErrorCode,
};

export {
	BLOG_POST_ERROR_MESSAGES,
	SHARED_BLOG_POST_ERROR_MESSAGES,
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
