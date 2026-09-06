<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
COMPONENTS: PAGES > BLOG-SECTIONS
> BLOG_DELETE_DIALOG.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, ref, watch } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import type { BlogPost } from '../../../api';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type BlogDeleteDialogEmits = {
	delete: [];
};

const visible = defineModel<boolean>('visible', {
	default: false,
});

const { blogPost, isDeleting } = defineProps<{
	blogPost: BlogPost | null;
	isDeleting: boolean;
}>();

const emit = defineEmits<BlogDeleteDialogEmits>();

const confirmDelete = ref<boolean>(false);

const deleteBlogPostLabel = computed<string>(
	() => blogPost?.header ?? 'this blog post',
);

const dialogBtnBaseStyleClasses = twMerge(
	clsx(
		'h-11! min-w-[9.5rem]! rounded-lg!',
		'cursor-pointer! px-4! text-sm! font-extrabold! shadow-none!',
		'ring-0! outline-none! transition-colors',
		'disabled:cursor-not-allowed!',
		'focus-visible:ring-2! focus-visible:ring-red-500! focus-visible:ring-offset-2!',
	),
);

const deleteBodyStyleClasses = twMerge(clsx('flex flex-col gap-4 p-5 tablet:p-6'));

const deleteWarningBoxStyleClasses = twMerge(
	clsx(
		'flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4',
		'dark:border-red-500/25 dark:bg-red-500/10',
	),
);

const deleteWarningIconStyleClasses = twMerge(
	clsx(
		'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
		'bg-red-600 text-white shadow-sm',
	),
);

const deleteWarningTitleStyleClasses = twMerge(
	clsx('text-sm font-extrabold text-red-800 dark:text-red-200'),
);

const deleteWarningTextStyleClasses = twMerge(
	clsx('mt-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200'),
);

const deleteCheckboxRowStyleClasses = twMerge(
	clsx(
		'flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3',
		'dark:border-gray-800 dark:bg-gray-900',
	),
);

const deleteCheckboxLabelStyleClasses = twMerge(
	clsx('cursor-pointer text-sm font-bold text-gray-700 select-none dark:text-gray-300'),
);

const deleteFooterStyleClasses = twMerge(
	clsx(
		'flex w-full flex-col-reverse gap-3 p-4',
		'tablet:flex-row tablet:items-center tablet:justify-end',
	),
);

const cancelButtonStyleClasses = twMerge(
	clsx(
		dialogBtnBaseStyleClasses,
		'border! border-gray-200! bg-white! text-gray-700! hover:bg-gray-50!',
		'dark:border-gray-700! dark:bg-gray-900! dark:text-gray-200! dark:hover:bg-gray-800!',
	),
);

const deleteForeverBtnStyleClasses = computed<string>(() =>
	twMerge(
		clsx(
			dialogBtnBaseStyleClasses,
			confirmDelete.value
				? 'border! border-red-600! bg-red-600! text-white! hover:bg-red-700!'
				: 'cursor-not-allowed! border! border-gray-200! bg-gray-100! text-gray-400! dark:border-gray-800! dark:bg-gray-800! dark:text-gray-500!',
		),
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
		class: 'bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-0!',
	},
};

const resetConfirmDelete = (): void => {
	confirmDelete.value = false;
};

watch(visible, (isVisible: boolean) => {
	if (!isVisible) {
		resetConfirmDelete();
	}
});

const handleCloseDeleteDialog = (): void => {
	visible.value = false;
	resetConfirmDelete();
};
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
               </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Dialog
		v-model:visible="visible"
		modal
		dismissable-mask
		class="w-[94vw] max-w-xl"
		:pt="dialogPt"
		@hide="resetConfirmDelete"
	>
		<template #header>
			<div class="flex items-center gap-3 pr-8">
				<span
					class="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
				>
					<i class="pi pi-exclamation-triangle text-sm" />
				</span>
				<div>
					<p class="text-base font-extrabold text-gray-950 dark:text-white">
						Delete Blog Post
					</p>
					<p class="text-xs font-semibold text-gray-500 dark:text-gray-400">
						This action requires confirmation.
					</p>
				</div>
			</div>
		</template>

		<div :class="deleteBodyStyleClasses">
			<!-- ∞∞∞∞∞∞∞∞ WARNING BOX ∞∞∞∞∞∞∞∞ -->
			<div :class="deleteWarningBoxStyleClasses">
				<span :class="deleteWarningIconStyleClasses">
					<i class="pi pi-trash text-sm" />
				</span>
				<div>
					<p :class="deleteWarningTitleStyleClasses">Permanent removal</p>
					<p :class="deleteWarningTextStyleClasses">
						You are about to permanently delete
						<strong>{{ deleteBlogPostLabel }}</strong
						>. This removes the blog post and its photos from the website.
					</p>
				</div>
			</div>

			<!-- ∞∞∞∞∞∞∞∞ CHECKBOX SAFETY GATE ∞∞∞∞∞∞∞∞ -->
			<div :class="deleteCheckboxRowStyleClasses">
				<Checkbox
					v-model="confirmDelete"
					input-id="confirm-delete"
					binary
				/>
				<label
					for="confirm-delete"
					:class="deleteCheckboxLabelStyleClasses"
				>
					I understand this is permanent.
				</label>
			</div>
		</div>

		<template #footer>
			<div :class="deleteFooterStyleClasses">
				<Button
					label="Cancel"
					icon="pi pi-times"
					:disabled="isDeleting"
					:class="cancelButtonStyleClasses"
					@click="handleCloseDeleteDialog"
				/>
				<Button
					label="Delete Forever"
					icon="pi pi-trash"
					:disabled="!confirmDelete || isDeleting"
					:loading="isDeleting"
					:class="deleteForeverBtnStyleClasses"
					@click="emit('delete')"
				/>
			</div>
		</template>
	</Dialog>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                   STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
