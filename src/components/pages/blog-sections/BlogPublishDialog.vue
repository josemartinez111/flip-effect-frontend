<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > BLOG-SECTIONS
    > BLOG_PUBLISH_DIALOG.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import type { BlogPost } from '../../../api';
import { UseBlogPublishDialogComposable } from './blog-page-composables/UseBlogPublishDialogComposable';
import type { BlogPublishFormValues } from './blog-page-composables/UseBlogPostsComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type BlogPublishDialogEmits = {
	publish: [formValues: BlogPublishFormValues];
};

const visible = defineModel<boolean>('visible', {
	default: false,
});

const { blogPost, isSubmitting } = defineProps<{
	blogPost: BlogPost | null;
	isSubmitting: boolean;
}>();

const emit = defineEmits<BlogPublishDialogEmits>();

const currentBlogPost = computed<BlogPost | null>(
	() => blogPost,
);

const {
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
} = UseBlogPublishDialogComposable({ blogPost: currentBlogPost });

watch(visible, (isVisible: boolean) => {
	if (isVisible) {
		syncFormWithBlogPost();
	}
});

const handlePublish = (): void => {
	emit('publish', getPublishFormValues());
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
		class="w-[94vw] max-w-3xl"
		:pt="dialogPt"
	>
		<template #header>
			<div class="flex items-center gap-3 pr-8">
				<span
					class="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
				>
					<i class="pi pi-file-edit text-sm" />
				</span>
				<div>
					<p class="text-base font-extrabold text-gray-950 dark:text-white">
						{{
							blogPost
								? 'Update Blog Post'
								: 'Publish Blog Post'
						}}
					</p>
					<p class="text-xs font-semibold text-gray-500 dark:text-gray-400">
						{{ blogPost ? 'Edit the live blog post' : 'Create the live blog post' }}
					</p>
				</div>
			</div>
		</template>

		<!-- ∞∞∞∞∞∞∞∞ FORM CARD ∞∞∞∞∞∞∞∞ -->
		<div :class="publishFormCardStyleClasses">
			<!-- ∞∞∞∞∞∞∞∞ CIRCULAR IMAGE UPLOAD ∞∞∞∞∞∞∞∞ -->
			<div class="flex flex-col gap-2">
				<div
					:class="uploadZoneStyleClasses"
					role="button"
					tabindex="0"
					aria-label="Upload blog post image"
					@click="triggerImageInput"
					@keydown.enter="triggerImageInput"
					@keydown.space.prevent="triggerImageInput"
				>
					<input
						:ref="setImageInputRef"
						type="file"
						accept="image/*"
						multiple
						class="hidden"
						@change="handleImageChange"
					/>
					<img
						v-if="formImagePreview"
						:src="formImagePreview"
						alt="Preview"
						:class="previewImageStyleClasses"
					/>
					<div v-else :class="uploadEmptyStateStyleClasses">
						<span :class="uploadEmptyIconStyleClasses">
							<i class="pi pi-image text-sm" />
						</span>
						<span :class="uploadEmptyTitleStyleClasses">
							Choose blog media
						</span>
						<span :class="uploadEmptyTextStyleClasses">
							Wide images work best for the blog post deck.
						</span>
					</div>
					<span
						v-if="formImageData.length > 0"
						class="absolute right-3 bottom-3 rounded-full bg-gray-950/85 px-3 py-1 text-xs font-bold text-white backdrop-blur"
					>
						{{ formImageData.length }} ready
					</span>
				</div>
				<span :class="uploadCountStyleClasses">
					{{
						formImageData.length > 0
							? `${formImageData.length} image${formImageData.length > 1 ? 's' : ''} ready`
							: 'Select images (any amount)'
					}}
				</span>
			</div>

			<!-- ∞∞∞∞∞∞∞∞ FORM GRID ∞∞∞∞∞∞∞∞ -->
			<form
				:class="publishFormGridStyleClasses"
				@submit.prevent="handlePublish"
			>
				<!-- ∞∞∞∞∞∞∞∞ BLOG TITLE (FULL WIDTH) ∞∞∞∞∞∞∞∞ -->
				<div :class="publishFieldStyleClasses">
					<label :class="publishFieldLabelStyleClasses"
						>Blog Title *</label
					>
					<div :class="publishInputShellStyleClasses">
						<div :class="publishInputIconShellStyleClasses">
							<i :class="['pi pi-pencil', publishInputIconStyleClasses]" />
						</div>
						<input
							v-model="formHeader"
							type="text"
							:class="publishTextInputStyleClasses"
							placeholder="Blog post title"
							required
						/>
					</div>
				</div>

				<!-- ∞∞∞∞∞∞∞∞ AUTHOR (FULL WIDTH) ∞∞∞∞∞∞∞∞ -->
				<div :class="publishFieldStyleClasses">
					<label :class="publishFieldLabelStyleClasses">Author *</label>
					<div :class="publishInputShellStyleClasses">
						<div :class="publishInputIconShellStyleClasses">
							<i :class="['pi pi-user', publishInputIconStyleClasses]" />
						</div>
						<Select
							v-model="formAuthor"
							:options="AUTHOR_OPTIONS"
							option-label="label"
							option-value="value"
							placeholder="Select author"
							:class="publishSelectStyleClasses"
						/>
					</div>
				</div>

				<!-- ∞∞∞∞∞∞∞∞ BODY CONTENT (FULL WIDTH) ∞∞∞∞∞∞∞∞ -->
				<div :class="publishFieldStyleClasses">
					<label :class="publishFieldLabelStyleClasses"
						>Body Content *</label
					>
					<textarea
						v-model="formBody"
						:class="publishTextareaStyleClasses"
						placeholder="Write the blog post body..."
						required
					/>
				</div>

				<!-- ∞∞∞∞∞∞∞∞ SUBMIT (RIGHT-ALIGNED) ∞∞∞∞∞∞∞∞ -->
				<div :class="publishSubmitContainerStyleClasses">
					<button
						type="submit"
						:class="publishSubmitButtonStyleClasses"
						:disabled="isSubmitting"
					>
						<i
							:class="[
								isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-send',
								'mr-2 text-sm',
							]"
						/>
						{{
							isSubmitting
								? 'Publishing'
								: blogPost
									? 'Update Blog Post'
									: 'Publish Blog Post'
						}}
					</button>
				</div>
			</form>
		</div>
	</Dialog>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                   STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
