<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > APPROVAL_RATING_TIER_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted, onUnmounted, ref } from 'vue';
import { TrumpAdminTimelineModalClick } from '../../../../assets';
import BaseModal from '../../../utils/BaseModal.vue';
import HomeBranchesBadge from '../hero/HomeBranchesBadge.vue';
import GovernmentCorruptionTimelineDeck from './GovernmentCorruptionTimelineDeck.vue';
import { UseApprovalRatingTierComposable } from '../../pages-composables/UseApprovalRatingTierComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Modal state stays local because each trigger only belongs to this homepage section. ---
const approvalTimelineModalOpen = ref(false);
const approvalTierRootElement = ref<HTMLElement>();
let approvalTierAnimationStarted = false;
let approvalTierIntersectionObserver: IntersectionObserver | undefined;

const {
	approvalRatingTierMaps,
	animatedApprovalRatingPercentage,
	economyApprovalSourceCaption,
	activeApprovalRatingTierMap,
	approvalTierCompositionStyleClasses,
	approvalTierSectionStyleClasses,
	approvalTierViewportStyleClasses,
	approvalTierEdgeStyleClasses,
	approvalTierTearShadowStyleClasses,
	approvalTierBadgeStyleClasses,
	approvalTierBadgeRowStyleClasses,
	approvalTierBadgeValueStyleClasses,
	economySourceTooltipStyleClasses,
	approvalTierBadgeLabelStyleClasses,
	approvalTierBadgeHeadlineStyleClasses,
	approvalTierBadgeDescriptionStyleClasses,
	approvalTimelineTriggerButtonStyleClasses,
	approvalTimelineTriggerImageStyleClasses,
	approvalTimelineModalRootStyleClasses,
	approvalTimelineModalContentWrapperStyleClasses,
	approvalTimelineModalHeaderStyleClasses,
	approvalTimelineModalCloseButtonStyleClasses,
	approvalTimelineModalCloseIconStyleClasses,
	getApprovalTierImageStyleClasses,
	startApprovalRatingAnimation,
	stopApprovalRatingAnimation,
} = UseApprovalRatingTierComposable();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- The approval drop should begin only once the tier map is actually in view. ---
const startApprovalRatingAnimationOnce = () => {
	if (approvalTierAnimationStarted) {
		return;
	}

	approvalTierAnimationStarted = true;
	startApprovalRatingAnimation();
};

// --- IntersectionObserver prevents the map/percentage story from playing off-screen. ---
onMounted(() => {
	if (
		!approvalTierRootElement.value ||
		!('IntersectionObserver' in window)
	) {
		startApprovalRatingAnimationOnce();
		return;
	}

	approvalTierIntersectionObserver = new IntersectionObserver(
		([{ isIntersecting }]) => {
			if (!isIntersecting) {
				return;
			}

			startApprovalRatingAnimationOnce();
			approvalTierIntersectionObserver?.disconnect();
		},
		{ threshold: 0.28 },
	);

	approvalTierIntersectionObserver.observe(approvalTierRootElement.value);
});

onUnmounted(() => {
	approvalTierIntersectionObserver?.disconnect();
	stopApprovalRatingAnimation();
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                    </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section
		ref="approvalTierRootElement"
		:class="approvalTierCompositionStyleClasses"
	>
		<!-- ∞∞∞∞∞∞∞∞ APPROVAL TIER: TRIGGER ROW (BRANCHES + TIMELINE) ∞∞∞∞∞∞∞∞ -->
		<div class="laptop:block flex items-start justify-center gap-4">
			<!-- ∞∞∞∞∞∞∞∞ APPROVAL TIER: THREE BRANCHES TRIGGER AND MODAL ∞∞∞∞∞∞∞∞ -->
			<HomeBranchesBadge />

			<!-- ∞∞∞∞∞∞∞∞ APPROVAL TIER: TIMELINE TRIGGER ∞∞∞∞∞∞∞∞ -->
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
		</div>

		<!-- ∞∞∞∞∞∞∞∞ APPROVAL TIER: ECONOMY MAP STORY ∞∞∞∞∞∞∞∞ -->
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
			</div>

			<!-- ∞∞∞∞∞∞∞∞ APPROVAL TIER: ECONOMY BADGE ∞∞∞∞∞∞∞∞ -->
			<div :class="approvalTierBadgeStyleClasses">
				<div :class="approvalTierBadgeRowStyleClasses">
					<span
						:class="[
							approvalTierBadgeValueStyleClasses,
							'group relative cursor-pointer',
						]"
					>
						{{ animatedApprovalRatingPercentage }}%
						<span :class="economySourceTooltipStyleClasses">
							{{ economyApprovalSourceCaption }}
						</span>
					</span>
					<span :class="approvalTierBadgeLabelStyleClasses">
						Economy approval
					</span>
				</div>

				<div :class="approvalTierBadgeHeadlineStyleClasses">
					{{ activeApprovalRatingTierMap.badgeHeadline }}
				</div>

				<div :class="approvalTierBadgeDescriptionStyleClasses">
					{{ activeApprovalRatingTierMap.badgeDescription }}
				</div>
			</div>
		</div>

		<!-- ∞∞∞∞∞∞∞∞ APPROVAL TIER: TIMELINE MODAL ∞∞∞∞∞∞∞∞ -->
		<BaseModal
			v-model:visible="approvalTimelineModalOpen"
			:root-class="approvalTimelineModalRootStyleClasses"
			:header-class="approvalTimelineModalHeaderStyleClasses"
			:content-class="approvalTimelineModalContentWrapperStyleClasses"
			:close-button-class="approvalTimelineModalCloseButtonStyleClasses"
			:close-button-icon-class="approvalTimelineModalCloseIconStyleClasses"
		>
			<GovernmentCorruptionTimelineDeck
				:active="approvalTimelineModalOpen"
			/>
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
