<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > APPROVAL_RATING_TIER_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { onMounted, onUnmounted, ref } from 'vue';
import {
	GovernmentChecksBalancesClick,
	TrumpAdminTimelineModalClick,
} from '../../../../assets';
import BaseModal from '../../../utils/BaseModal.vue';
import GovernmentChecksBalancesQuiz from './GovernmentChecksBalancesQuiz.vue';
import { UseApprovalRatingTierComposable } from '../../pages-composables/UseApprovalRatingTierComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const approvalTimelineModalOpen = ref(false);
const approvalQuizModalOpen = ref(false);

const {
	approvalRatingTierMaps,
	animatedApprovalRatingPercentage,
	approvalTierCompositionStyleClasses,
	approvalTierSectionStyleClasses,
	approvalTierViewportStyleClasses,
	approvalTierEdgeStyleClasses,
	approvalTierTearShadowStyleClasses,
	approvalTierBadgeStyleClasses,
	approvalTierBadgeValueStyleClasses,
	approvalTierBadgeLabelStyleClasses,
	approvalTimelineTriggerButtonStyleClasses,
	approvalTimelineTriggerImageStyleClasses,
	approvalQuizTriggerButtonStyleClasses,
	approvalQuizTriggerImageStyleClasses,
	approvalTimelineModalRootStyleClasses,
	approvalTimelineModalContentWrapperStyleClasses,
	approvalTimelineModalHeaderStyleClasses,
	approvalTimelineModalCloseButtonStyleClasses,
	approvalTimelineModalCloseIconStyleClasses,
	approvalTimelineModalCardStyleClasses,
	approvalTimelineModalCardBodyStyleClasses,
	approvalTimelineModalCardContentStyleClasses,
	approvalTimelineModalImageStyleClasses,
	approvalQuizModalRootStyleClasses,
	getApprovalTierImageStyleClasses,
	startApprovalRatingAnimation,
	stopApprovalRatingAnimation,
} = UseApprovalRatingTierComposable();

onMounted(() => {
	startApprovalRatingAnimation();
});

onUnmounted(() => {
	stopApprovalRatingAnimation();
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                    </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="approvalTierCompositionStyleClasses">
		<button
			type="button"
			:class="approvalTimelineTriggerButtonStyleClasses"
			aria-label="Open Trump administration timeline"
			@click="approvalTimelineModalOpen = true"
		>
			<img
				:src="TrumpAdminTimelineModalClick"
				alt="Trump administration timeline"
				:class="approvalTimelineTriggerImageStyleClasses"
			/>
		</button>

		<button
			type="button"
			:class="approvalQuizTriggerButtonStyleClasses"
			aria-label="Open government checks and balances quiz"
			@click="approvalQuizModalOpen = true"
		>
			<img
				:src="GovernmentChecksBalancesClick"
				alt="Government checks and balances quiz"
				:class="approvalQuizTriggerImageStyleClasses"
			/>
		</button>

		<div :class="approvalTierSectionStyleClasses">
			<div :class="approvalTierTearShadowStyleClasses"></div>

			<div :class="approvalTierViewportStyleClasses">
				<img
					v-for="(tierMap, index) in approvalRatingTierMaps"
					:key="tierMap.image"
					:src="tierMap.image"
					:alt="tierMap.alt"
					:class="getApprovalTierImageStyleClasses(index)"
				/>

				<div :class="approvalTierEdgeStyleClasses"></div>

				<div :class="approvalTierBadgeStyleClasses">
					<span :class="approvalTierBadgeValueStyleClasses">
						{{ animatedApprovalRatingPercentage }}%
					</span>
					<span :class="approvalTierBadgeLabelStyleClasses">
						Approval
					</span>
				</div>
			</div>
		</div>

		<BaseModal
			v-model:visible="approvalTimelineModalOpen"
			:root-class="approvalTimelineModalRootStyleClasses"
			:header-class="approvalTimelineModalHeaderStyleClasses"
			:content-class="approvalTimelineModalContentWrapperStyleClasses"
			:close-button-class="approvalTimelineModalCloseButtonStyleClasses"
			:close-button-icon-class="approvalTimelineModalCloseIconStyleClasses"
		>
			<Card
				unstyled
				:class="approvalTimelineModalCardStyleClasses"
				:pt="{
					body: { class: approvalTimelineModalCardBodyStyleClasses },
					content: { class: approvalTimelineModalCardContentStyleClasses },
				}"
			>
				<template #content>
					<img
						:src="TrumpAdminTimelineModalClick"
						alt="Trump administration timeline"
						:class="approvalTimelineModalImageStyleClasses"
					/>
				</template>
			</Card>
		</BaseModal>

		<BaseModal
			v-model:visible="approvalQuizModalOpen"
			:root-class="approvalQuizModalRootStyleClasses"
			:header-class="approvalTimelineModalHeaderStyleClasses"
			:content-class="approvalTimelineModalContentWrapperStyleClasses"
			:close-button-class="approvalTimelineModalCloseButtonStyleClasses"
			:close-button-icon-class="approvalTimelineModalCloseIconStyleClasses"
		>
			<GovernmentChecksBalancesQuiz :active="approvalQuizModalOpen" />
		</BaseModal>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
