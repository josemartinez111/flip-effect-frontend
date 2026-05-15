<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > APPROVAL_RATING_TIER_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted, onUnmounted } from 'vue';
import { UseApprovalRatingTierComposable } from './UseApprovalRatingTierComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	approvalRatingTierMaps,
	TRUMP_APPROVAL_RATING,
	approvalTierSectionStyleClasses,
	approvalTierViewportStyleClasses,
	approvalTierEdgeStyleClasses,
	approvalTierTearShadowStyleClasses,
	approvalTierBadgeStyleClasses,
	approvalTierBadgeValueStyleClasses,
	approvalTierBadgeLabelStyleClasses,
	getApprovalTierImageStyleClasses,
	startApprovalRatingTierAnimation,
	stopApprovalRatingTierAnimation,
} = UseApprovalRatingTierComposable();

onMounted(() => {
	startApprovalRatingTierAnimation();
});

onUnmounted(() => {
	stopApprovalRatingTierAnimation();
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="approvalTierSectionStyleClasses">
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
					{{ TRUMP_APPROVAL_RATING }}%
				</span>
				<span :class="approvalTierBadgeLabelStyleClasses">
					Approval
				</span>
			</div>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
