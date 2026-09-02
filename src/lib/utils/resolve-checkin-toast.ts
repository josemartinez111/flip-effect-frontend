// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB: UTILS
// > RESOLVE_CHECKIN_TOAST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { useToast } from 'primevue/usetoast';
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

export const useSharedBlogPostToast = () => {
	const toast = useToast();

	const showSharedBlogPostErrorToast = (errorCode: SharedBlogPostErrorCode): void => {
		const { severity, summary, detail } = SHARED_BLOG_POST_ERROR_MESSAGES[errorCode];
		toast.add({ severity, summary, detail, life: 5000 });
	};

	return { showSharedBlogPostErrorToast };
};

export const useBlogPostToast = () => {
	const toast = useToast();

	const showBlogPostErrorToast = (errorCode: BlogPostErrorCode): void => {
		const { severity, summary, detail } = BLOG_POST_ERROR_MESSAGES[errorCode];
		toast.add({ severity, summary, detail, life: 5000 });
	};

	const showBlogPostToast = (data: ActionToastData, life = 4000): void => {
		const { severity, summary, detail } = data;
		toast.add({ severity, summary, detail, life });
	};

	return { showBlogPostErrorToast, showBlogPostToast };
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
