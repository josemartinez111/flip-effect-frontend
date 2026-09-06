<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
COMPONENTS: PAGES > BLOG-SECTIONS
> BLOG_ADMIN_CONTROLS_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BlogPost } from '../../../api';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type BlogAdminControlsSectionEmits = (
	eventName: 'publish' | 'delete',
) => void;

const { blogPost } = defineProps<{
	blogPost: BlogPost | null;
}>();

const emit = defineEmits<BlogAdminControlsSectionEmits>();

const hasBlogPost = computed<boolean>(() => Boolean(blogPost));

const currentBlogLabel = computed<string>(
	() => blogPost?.header ?? 'No blog post published',
);

const adminStripStyleClasses = twMerge(
	clsx(
		'relative z-10 flex w-full max-w-7xl flex-col gap-4',
		'rounded-xl border border-gray-200 bg-white/95 px-4 py-4 shadow-sm',
		'ring-1 ring-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 dark:ring-white/10',
		'tablet:flex-row tablet:items-center tablet:justify-between tablet:px-5',
	),
);

const adminHeadingGroupStyleClasses = twMerge(
	clsx('flex min-w-0 items-center gap-3'),
);

const adminIconShellStyleClasses = twMerge(
	clsx(
		'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
		'border border-blue-200 bg-blue-50 text-blue-600',
		'dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
	),
);

const adminEyebrowStyleClasses = twMerge(
	clsx('text-[0.68rem] font-extrabold tracking-widest text-gray-400 uppercase'),
);

const adminTitleStyleClasses = twMerge(
	clsx('max-w-[26rem] truncate text-sm font-bold text-gray-900 dark:text-white'),
);

const adminActionsStyleClasses = twMerge(
	clsx(
		'flex w-full flex-col gap-2',
		'tablet:w-auto tablet:flex-row tablet:items-center tablet:justify-end',
	),
);

const adminBtnBaseStyleClasses = twMerge(
	clsx(
		'inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4',
		'cursor-pointer text-sm font-bold transition-colors',
		'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
		'disabled:cursor-not-allowed disabled:opacity-55',
		'tablet:w-auto',
	),
);

const adminBtnPublishStyleClasses = twMerge(
	clsx(
		adminBtnBaseStyleClasses,
		'border border-gray-950 bg-gray-950 text-white hover:bg-gray-800',
		'dark:border-white dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200',
	),
);

const adminBtnDeleteStyleClasses = computed<string>(() =>
	twMerge(
		clsx(
			adminBtnBaseStyleClasses,
			hasBlogPost.value
				? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20'
				: 'border border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-500',
		),
	),
);

const statusPillStyleClasses = computed<string>(() =>
	twMerge(
		clsx(
			'inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-3',
			'text-xs font-extrabold tracking-wide uppercase tablet:w-auto',
			hasBlogPost.value
				? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
				: 'border border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400',
		),
	),
);
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                 </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div :class="adminStripStyleClasses">
		<div :class="adminHeadingGroupStyleClasses">
			<span :class="adminIconShellStyleClasses">
				<i class="pi pi-sliders-h text-sm" />
			</span>
			<div class="min-w-0">
				<p :class="adminEyebrowStyleClasses">Admin Controls</p>
				<p :class="adminTitleStyleClasses">{{ currentBlogLabel }}</p>
			</div>
		</div>

		<div :class="adminActionsStyleClasses">
			<!-- ∞∞∞∞∞∞∞∞ STATUS PILL ∞∞∞∞∞∞∞∞ -->
			<span :class="statusPillStyleClasses">
				<i :class="blogPost ? 'pi pi-check-circle' : 'pi pi-circle'" />
				{{ blogPost ? 'Live' : 'Empty' }}
			</span>

			<button
				type="button"
				:class="adminBtnPublishStyleClasses"
				@click="emit('publish')"
			>
				<i class="pi pi-file-edit text-sm" />
				{{ blogPost ? 'Update' : 'Publish' }}
			</button>

			<button
				type="button"
				:class="adminBtnDeleteStyleClasses"
				:disabled="!blogPost"
				@click="emit('delete')"
			>
				<i class="pi pi-trash text-sm" />
				Delete
			</button>
		</div>
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                  STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
