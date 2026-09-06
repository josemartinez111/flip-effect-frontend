// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//  COMPONENTS: PAGES > BLOG-SECTIONS > BLOG-PAGE-COMPOSABLES
//  > USE_BLOG_POSTS_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	fetchCurrentBlogPostAction,
	fetchHardRemoveBlogPostAction,
	fetchPublishBlogPostAction,
} from '../../../../api';
import type { BlogPost, PublishBlogPostPayload } from '../../../../api';
import { UseBlogPostToastComposable } from '../../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Form values the publish dialog emits — this composable owns the
// API payload assembly (date stamp, null-image passthrough).
// ---
export type BlogPublishFormValues = {
	header: string;
	author: string;
	blogBody: string;
	// --- null → backend preserves existing images; base64 array → backend uploads new ones ---
	imageData: Array<string> | null;
};

export const UseBlogPostsComposable = () => {
	const { showBlogPostErrorToast, showBlogPostToast } =
		UseBlogPostToastComposable();

	// --- Blog post data ---
	const currentBlogPost = ref<BlogPost | null>(null);
	const isLoading = ref<boolean>(false);

	// --- Admin: dialog visibility + async flags ---
	const isPublishDialogVisible = ref<boolean>(false);
	const isDeleteDialogVisible = ref<boolean>(false);
	const formIsSubmitting = ref<boolean>(false);
	const isDeleting = ref<boolean>(false);

	const pageStyleClasses = twMerge(
		clsx(
			'relative overflow-hidden',
			'min-h-screen w-full',
			'flex flex-col items-center justify-start gap-8',
			'px-6 pt-10 pb-16 laptop:px-10 laptop:pt-12',
			'bg-gray-50 dark:bg-gray-950',
		),
	);

	// --- Background reads fail quietly so route mounts and refreshes never create action toasts. ---
	const fetchBlogPost = async (): Promise<void> => {
		isLoading.value = true;
		const result = await fetchCurrentBlogPostAction();

		if (result.success && result.data) {
			currentBlogPost.value = result.data;
		}

		isLoading.value = false;
	};

	// --- Admin: open dialogs (publish dialog pre-populates itself on open) ---
	const handleOpenPublishDialog = (): void => {
		isPublishDialogVisible.value = true;
	};

	const handleOpenDeleteDialog = (): void => {
		isDeleteDialogVisible.value = true;
	};

	// --- Admin: publish / upsert blog post ---
	const handlePublish = async (
		formValues: BlogPublishFormValues,
	): Promise<void> => {
		const header = formValues.header.trim();
		const blogBody = formValues.blogBody.trim();

		if (!header || !blogBody) {
			showBlogPostToast({
				severity: 'warn',
				summary: 'Missing Fields',
				detail: 'Title and body are required.',
			});
			return;
		}

		formIsSubmitting.value = true;

		// --- Auto-generate today's date in ISO format "YYYY-MM-DD" ---
		const displayDate = new Date().toISOString().split('T')[0];

		const payload: PublishBlogPostPayload = {
			header,
			author: formValues.author,
			displayDate,
			blogBody,
			imageData: formValues.imageData,
		};

		const result = await fetchPublishBlogPostAction(payload);

		if (result.success && result.data) {
			currentBlogPost.value = result.data;
			isPublishDialogVisible.value = false;
			showBlogPostToast(
				{
					severity: 'success',
					summary: 'Published',
					detail: 'Blog post is now live.',
				},
				3000,
			);
		} else {
			showBlogPostErrorToast(result.errorCode ?? 'SERVER_ERROR');
		}

		formIsSubmitting.value = false;
	};

	// --- Admin: hard delete blog post ---
	const handleDelete = async (): Promise<void> => {
		if (!currentBlogPost.value) {
			return;
		}
		isDeleting.value = true;

		const result = await fetchHardRemoveBlogPostAction(
			currentBlogPost.value.blogPostId,
		);

		if (result.success) {
			currentBlogPost.value = null;
			isDeleteDialogVisible.value = false;
			showBlogPostToast(
				{
					severity: 'success',
					summary: 'Deleted',
					detail: 'Blog post permanently removed.',
				},
				3000,
			);
		} else {
			showBlogPostErrorToast(result.errorCode ?? 'SERVER_ERROR');
		}

		isDeleting.value = false;
	};

	return {
		pageStyleClasses,
		currentBlogPost,
		isLoading,
		isPublishDialogVisible,
		isDeleteDialogVisible,
		formIsSubmitting,
		isDeleting,
		fetchBlogPost,
		handleOpenPublishDialog,
		handleOpenDeleteDialog,
		handlePublish,
		handleDelete,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
