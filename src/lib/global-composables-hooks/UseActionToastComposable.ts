// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > GLOBAL-COMPOSABLES-HOOKS > USE_ACTION_TOAST_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
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
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type SharedActionToast = {
	showSharedBlogPostErrorToast: (
		errorCode: SharedBlogPostErrorCode,
	) => void;
};

type BlogPostToast = {
	showBlogPostErrorToast: (errorCode: BlogPostErrorCode) => void;
	showBlogPostToast: (data: ActionToastData, life?: number) => void;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseSharedActionToastComposable = (): SharedActionToast => {
	const toast = useToast();

	const showSharedBlogPostErrorToast = (
		errorCode: SharedBlogPostErrorCode,
	): void => {
		const { severity, summary, detail } =
			SHARED_BLOG_POST_ERROR_MESSAGES[errorCode];
		toast.add({ severity, summary, detail, life: 5000 });
	};

	const sharedActionToast: SharedActionToast = {
		showSharedBlogPostErrorToast,
	};

	return sharedActionToast;
};

export const UseBlogPostToastComposable = (): BlogPostToast => {
	const toast = useToast();

	const showBlogPostErrorToast = (errorCode: BlogPostErrorCode): void => {
		const { severity, summary, detail } =
			BLOG_POST_ERROR_MESSAGES[errorCode];
		toast.add({ severity, summary, detail, life: 5000 });
	};

	const showBlogPostToast = (data: ActionToastData, life = 4000): void => {
		const { severity, summary, detail } = data;
		toast.add({ severity, summary, detail, life });
	};

	const blogPostToast: BlogPostToast = {
		showBlogPostErrorToast,
		showBlogPostToast,
	};

	return blogPostToast;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
