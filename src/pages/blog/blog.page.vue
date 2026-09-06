<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: BLOG > BLOG.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted } from 'vue';
import { UseAdminVisibleComposable } from '../../lib';
import type { AuthMode } from '../../lib';
import { Show } from '../../components';
import BlogDeckSection from '../../components/pages/blog-sections/BlogDeckSection.vue';
import BlogAdminControlsSection from '../../components/pages/blog-sections/BlogAdminControlsSection.vue';
import BlogDeleteDialog from '../../components/pages/blog-sections/BlogDeleteDialog.vue';
import BlogPublishDialog from '../../components/pages/blog-sections/BlogPublishDialog.vue';
import { UseBlogPostsComposable } from '../../components/pages/blog-sections/blog-page-composables/UseBlogPostsComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Admin controls visibility — which version of this page renders.
// ROUTER-CONTROLLED: the blog route in routes.ts injects adminMode
// via route props. 'auth' = admin UI only when logged in;
// 'maintenance' = force-show admin UI with no auth. Flip it in routes.ts.
// ---
const { adminMode } = defineProps<{ adminMode: AuthMode }>();

const isAdmin = UseAdminVisibleComposable(adminMode);

const {
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
} = UseBlogPostsComposable();

onMounted(() => {
	// --- Silently degrades to defaults if VITE_BLOG_CURRENT_API_URL is not set ---
	void fetchBlogPost();
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main :class="pageStyleClasses">
		<!-- ∞∞∞∞∞∞∞∞ ADMIN CONTROLS STRIP ∞∞∞∞∞∞∞∞ -->
		<Show :when="isAdmin">
			<!-- ∞∞∞∞∞∞∞∞ BLOGADMINCONTROLSSECTION ∞∞∞∞∞∞∞∞ -->
			<BlogAdminControlsSection
				:blog-post="currentBlogPost"
				@publish="handleOpenPublishDialog"
				@delete="handleOpenDeleteDialog"
			/>
		</Show>

		<!-- ∞∞∞∞∞∞∞∞ BLOG DECK ∞∞∞∞∞∞∞∞ -->
		<BlogDeckSection
			:blog-post="currentBlogPost"
			:is-loading="isLoading"
		/>

		<!-- 
		∞∞∞∞∞∞∞∞
		ADMIN DIALOGS
		The router-owned auth mode controls whether these dialogs render.
		∞∞∞∞∞∞∞∞
		-->
		<Show :when="isAdmin">
			<!-- ∞∞∞∞∞∞∞∞ BLOGPUBLISHDIALOG ∞∞∞∞∞∞∞∞ -->
			<BlogPublishDialog
				v-model:visible="isPublishDialogVisible"
				:blog-post="currentBlogPost"
				:is-submitting="formIsSubmitting"
				@publish="handlePublish"
			/>

			<!-- ∞∞∞∞∞∞∞∞ BLOGDELETEDIALOG ∞∞∞∞∞∞∞∞ -->
			<BlogDeleteDialog
				v-model:visible="isDeleteDialogVisible"
				:blog-post="currentBlogPost"
				:is-deleting="isDeleting"
				@delete="handleDelete"
			/>
		</Show>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
