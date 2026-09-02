<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: BLOG > BLOG.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted } from 'vue';
import Toast from 'primevue/toast';
import { useAdminVisible } from '../../lib';
import type { AdminVisibleMode } from '../../lib';
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
const { adminMode } = defineProps<{ adminMode: AdminVisibleMode }>();

const isAdmin = useAdminVisible(adminMode);

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
	<Toast />

	<main :class="pageStyleClasses">
		<!-- --- Admin controls strip --- -->
		<Show :when="isAdmin">
			<!-- COMPONENT: BlogAdminControlsSection -->
			<BlogAdminControlsSection
				:blog-post="currentBlogPost"
				@publish="handleOpenPublishDialog"
				@delete="handleOpenDeleteDialog"
			/>
		</Show>

		<!-- --- Blog Deck --- -->
		<BlogDeckSection
			:blog-post="currentBlogPost"
			:is-loading="isLoading"
		/>

		<!-- 
		Admin controls dialogs are rendered conditionally,
		& controlled by the adminMode prop, which is set in the router.
		-->
		<Show :when="isAdmin">
			<!-- COMPONENT: BlogPublishDialog -->
			<BlogPublishDialog
				v-model:visible="isPublishDialogVisible"
				:blog-post="currentBlogPost"
				:is-submitting="formIsSubmitting"
				@publish="handlePublish"
			/>

			<!-- COMPONENT: BlogDeleteDialog -->
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
