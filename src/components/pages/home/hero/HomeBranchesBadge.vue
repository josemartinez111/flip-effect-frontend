<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > HERO
    > HOME_BRANCHES_BADGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { ref } from 'vue';
import {
	KnowYourBranches,
	ThreeBranchesOfGovernmentClick,
} from '../../../../assets';
import { UseHomeHeroComposable } from '../../pages-composables/UseHomeHeroComposable.ts';
import BaseModal from '../../../utils/BaseModal.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const threeBranchesModalOpen = ref(false);

const {
	branchesTriggerButtonStyleClasses,
	branchesTriggerImageStyleClasses,
	branchesModalRootStyleClasses,
	branchesModalContentWrapperStyleClasses,
	branchesModalHeaderStyleClasses,
	branchesModalCloseButtonStyleClasses,
	branchesModalCloseIconStyleClasses,
	branchesModalCardStyleClasses,
	branchesModalCardBodyStyleClasses,
	branchesModalCardContentStyleClasses,
	branchesModalImageStyleClasses,
} = UseHomeHeroComposable();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                    </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<button
		type="button"
		:class="branchesTriggerButtonStyleClasses"
		aria-label="Open three branches of government"
		@click="threeBranchesModalOpen = true"
	>
		<img
			:src="KnowYourBranches"
			alt="Know Your Branches"
			:class="branchesTriggerImageStyleClasses"
		/>
	</button>

	<BaseModal
		v-model:visible="threeBranchesModalOpen"
		:root-class="branchesModalRootStyleClasses"
		:header-class="branchesModalHeaderStyleClasses"
		:content-class="branchesModalContentWrapperStyleClasses"
		:close-button-class="branchesModalCloseButtonStyleClasses"
		:close-button-icon-class="branchesModalCloseIconStyleClasses"
	>
		<Card
			unstyled
			:class="branchesModalCardStyleClasses"
			:pt="{
				body: { class: branchesModalCardBodyStyleClasses },
				content: { class: branchesModalCardContentStyleClasses },
			}"
		>
			<template #content>
				<img
					:src="ThreeBranchesOfGovernmentClick"
					alt="Three branches of government"
					:class="branchesModalImageStyleClasses"
				/>
			</template>
		</Card>
	</BaseModal>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
