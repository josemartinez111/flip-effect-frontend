<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > HERO
    > HOME_HERO_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { ref } from 'vue';
import {
	DominoEffectBGHomePage,
	KnowYourBranches,
	ThreeBranchesOfGovernment,
} from '../../../../assets';
import { UseHomeComposable } from '../../../../pages/home/UseHomeComposable.ts';
import BaseModal from '../../../utils/BaseModal.vue';
import HeroApprovalRatingCard from '../approval-rating/HeroApprovalRatingCard.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const threeBranchesModalOpen = ref(false);

const {
	heroSectionStyleClasses,
	heroContentContainerStyleClasses,
	heroCardShellStyleClasses,
	branchesTriggerButtonStyleClasses,
	branchesTriggerImageStyleClasses,
	branchesModalCardStyleClasses,
	branchesModalCardBodyStyleClasses,
	branchesModalCardContentStyleClasses,
	branchesModalBgImageStyleClasses,
	branchesModalImageStyleClasses,
} = UseHomeComposable();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ MARKUP ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
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

	<section :class="heroSectionStyleClasses">
		<div :class="heroContentContainerStyleClasses">
			<div :class="heroCardShellStyleClasses">
				<HeroApprovalRatingCard />
			</div>
		</div>
	</section>

	<BaseModal v-model:visible="threeBranchesModalOpen">
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
					:src="DominoEffectBGHomePage"
					alt=""
					:class="branchesModalBgImageStyleClasses"
					aria-hidden="true"
				/>
				<img
					:src="ThreeBranchesOfGovernment"
					alt="Three branches of government"
					:class="branchesModalImageStyleClasses"
				/>
			</template>
		</Card>
	</BaseModal>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ STYLES ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
