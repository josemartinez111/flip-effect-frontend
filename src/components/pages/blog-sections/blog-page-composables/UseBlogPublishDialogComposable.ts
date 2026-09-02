// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//  COMPONENTS: PAGES > BLOG-SECTIONS > BLOG-PAGE-COMPOSABLES
//  > USE_BLOG_PUBLISH_DIALOG_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref, type ComputedRef } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BlogPost } from '../../../../api';
import { EL, loadBlogImagesToCanvas, useBlogPostToast } from '../../../../lib';
import type { BlogPublishFormValues } from './UseBlogPostsComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type BlogAuthorOption = {
	label: string;
	value: string;
};

type UseBlogPublishDialogComposableOptions = {
	blogPost: ComputedRef<BlogPost | null>;
};

// ---
// AUTHOR OPTIONS — publish form dropdown. Keys must match AUTHOR_MAP
// in BlogDeckSection.vue. Replace placeholders per project.
// ---
const AUTHOR_OPTIONS: Array<BlogAuthorOption> = [
	{ label: 'Author One', value: 'author-one' },
	{ label: 'Author Two', value: 'author-two' },
	{ label: 'Author Three', value: 'author-three' },
	{ label: 'Author Four', value: 'author-four' },
];

export const UseBlogPublishDialogComposable = ({
	blogPost,
}: UseBlogPublishDialogComposableOptions) => {
	const { showBlogPostToast } = useBlogPostToast();

	const formHeader = ref<string>(EL.STR_EMPTY);
	const formAuthor = ref<string>('author-one');
	const formBody = ref<string>(EL.STR_EMPTY);
	const formImagePreview = ref<string | null>(null);
	const formImageData = ref<Array<string>>([]);
	const imageInputRef = ref<HTMLInputElement | null>(null);

	const publishFormCardStyleClasses = twMerge(
		clsx(
			'flex w-full flex-col gap-5',
			'bg-white px-5 py-5 dark:bg-gray-950 tablet:px-6 tablet:py-6',
		),
	);

	const uploadZoneStyleClasses = twMerge(
		clsx(
			'relative flex aspect-video w-full items-center justify-center overflow-hidden',
			'rounded-xl border border-dashed border-blue-300 bg-blue-50/60',
			'cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-50',
			'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
			'dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:border-blue-300 dark:hover:bg-blue-500/15',
		),
	);

	const previewImageStyleClasses = twMerge(
		clsx('h-full w-full object-cover'),
	);

	const uploadEmptyStateStyleClasses = twMerge(
		clsx(
			'pointer-events-none flex flex-col items-center justify-center gap-2',
			'px-5 text-center select-none',
		),
	);

	const uploadEmptyIconStyleClasses = twMerge(
		clsx(
			'flex h-11 w-11 items-center justify-center rounded-lg',
			'border border-blue-200 bg-white text-blue-600 shadow-sm',
			'dark:border-blue-400/30 dark:bg-gray-950 dark:text-blue-300',
		),
	);

	const uploadEmptyTitleStyleClasses = twMerge(
		clsx('text-sm font-extrabold text-gray-900 dark:text-white'),
	);

	const uploadEmptyTextStyleClasses = twMerge(
		clsx('text-xs font-medium text-gray-500 dark:text-gray-400'),
	);

	const uploadCountStyleClasses = twMerge(
		clsx('text-xs font-semibold text-gray-500 dark:text-gray-400'),
	);

	const publishFormGridStyleClasses = twMerge(
		clsx('grid w-full grid-cols-1 gap-x-4 gap-y-4 tablet:grid-cols-3'),
	);

	const publishFieldStyleClasses = twMerge(clsx('tablet:col-span-3'));

	const publishFieldLabelStyleClasses = twMerge(
		clsx('mb-1.5 block text-xs font-extrabold tracking-wide text-gray-500 uppercase'),
	);

	const publishInputShellStyleClasses = twMerge(
		clsx(
			'inline-flex h-11 w-full overflow-hidden rounded-lg border border-gray-200',
			'bg-white transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15',
			'dark:border-gray-800 dark:bg-gray-900',
		),
	);

	const publishInputIconShellStyleClasses = twMerge(
		clsx('flex w-10 items-center justify-center bg-gray-50 dark:bg-gray-800'),
	);

	const publishInputIconStyleClasses = twMerge(clsx('text-sm text-gray-400'));

	const publishTextInputStyleClasses = twMerge(
		clsx('w-full bg-transparent px-3 text-sm font-medium focus:outline-hidden'),
	);

	const publishSelectStyleClasses = twMerge(
		clsx('w-full cursor-pointer border-none bg-transparent text-sm font-medium shadow-none'),
	);

	const publishTextareaStyleClasses = twMerge(
		clsx(
			'min-h-44 w-full resize-y rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium',
			'transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-hidden',
			'dark:border-gray-800 dark:bg-gray-900',
		),
	);

	const publishSubmitContainerStyleClasses = twMerge(
		clsx('flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800 tablet:col-span-3'),
	);

	const publishSubmitButtonStyleClasses = twMerge(
		clsx(
			'inline-flex h-11 min-w-44 cursor-pointer items-center justify-center rounded-lg',
			'bg-gray-950 px-5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-gray-800',
			'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200',
		),
	);

	const dialogPt = {
		root: {
			class:
				'overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-gray-800 dark:bg-gray-950 dark:text-white',
		},
		header: {
			class: 'bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-5 py-4',
		},
		content: {
			class: 'bg-white text-gray-900 dark:bg-gray-950 dark:text-white p-0!',
		},
		footer: {
			class: 'bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800',
		},
	};

	const resetImageFields = (): void => {
		formImagePreview.value = null;
		formImageData.value = [];
	};

	const setImageInputRef = (element: unknown): void => {
		imageInputRef.value = element instanceof HTMLInputElement ? element : null;
	};

	const syncFormWithBlogPost = (): void => {
		const currentBlogPost = blogPost.value;

		if (currentBlogPost) {
			formHeader.value = currentBlogPost.header;
			formAuthor.value = currentBlogPost.author;
			formBody.value = currentBlogPost.blogBody;
		} else {
			formHeader.value = EL.STR_EMPTY;
			formAuthor.value = 'author-one';
			formBody.value = EL.STR_EMPTY;
		}

		resetImageFields();
	};

	const triggerImageInput = (): void => {
		imageInputRef.value?.click();
	};

	const handleImageChange = async (event: Event): Promise<void> => {
		if (!(event.target instanceof HTMLInputElement)) {
			return;
		}

		const files = Array.from(event.target.files ?? []).filter((file: File) =>
			file.type.startsWith('image/'),
		);

		if (files.length === 0) {
			return;
		}

		try {
			const base64Images = await loadBlogImagesToCanvas(files);

			if (base64Images === null) {
				showBlogPostToast(
					{
						severity: 'warn',
						summary: 'Too Many Images',
						detail: 'Total image size is too large. Remove some images and try again.',
					},
					6000,
				);
				resetImageFields();
				return;
			}

			formImagePreview.value = base64Images[0] ?? null;
			formImageData.value = base64Images;
		} catch (error: unknown) {
			if (error instanceof Error) {
				showBlogPostToast({
					severity: 'error',
					summary: 'Image Error',
					detail: error.message,
				});
			}
			resetImageFields();
		}
	};

	const getPublishFormValues = (): BlogPublishFormValues => ({
		header: formHeader.value,
		author: formAuthor.value,
		blogBody: formBody.value,
		imageData: formImageData.value.length > 0 ? formImageData.value : null,
	});

	return {
		AUTHOR_OPTIONS,
		formHeader,
		formAuthor,
		formBody,
		formImagePreview,
		formImageData,
		publishFormCardStyleClasses,
		uploadZoneStyleClasses,
		previewImageStyleClasses,
		uploadEmptyStateStyleClasses,
		uploadEmptyIconStyleClasses,
		uploadEmptyTitleStyleClasses,
		uploadEmptyTextStyleClasses,
		uploadCountStyleClasses,
		publishFormGridStyleClasses,
		publishFieldStyleClasses,
		publishFieldLabelStyleClasses,
		publishInputShellStyleClasses,
		publishInputIconShellStyleClasses,
		publishInputIconStyleClasses,
		publishTextInputStyleClasses,
		publishSelectStyleClasses,
		publishTextareaStyleClasses,
		publishSubmitContainerStyleClasses,
		publishSubmitButtonStyleClasses,
		dialogPt,
		setImageInputRef,
		syncFormWithBlogPost,
		triggerImageInput,
		handleImageChange,
		getPublishFormValues,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
