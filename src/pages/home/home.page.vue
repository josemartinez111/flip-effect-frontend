<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: HOME > HOME_PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted } from 'vue';
import {
	ApprovalRatingTierSection,
	CongressionalControlSection,
	CivicRepresentativeSearchSection,
	FWTScrollAnimation,
	GeneralElectionCountdownSection,
	HomeBranchesBadge,
	HomeHeroSection,
} from '../../components';
import { UseHomeComposable } from '../../components/pages/pages-composables/UseHomeComposable.ts';
import { UseHomePageContentComposable } from '../../components/pages/pages-composables/UseHomePageContentComposable.ts';
import { useApprovalStore } from '../../lib/stores/UseApprovalStore.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const { mainContainerStyleClasses } = UseHomeComposable();

const {
	civicRepresentativeSearchTitle,
	civicRepresentativeSearchPlaceholder,
	civicRepresentativeSearchFilterOptions,
	civicRepresentativeSearchDefaultFilters,
	congressionalControlChambers,
} = UseHomePageContentComposable();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

onMounted(() => {
	// --- One fetch fills both feeds in the store; the hero card + tier map read them reactively. ---
	useApprovalStore().fetchApprovalRatings();
});
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main :class="mainContainerStyleClasses">
		<!-- COMPONENT-GROUP: top badge row (countdown + branches) -->
		<div
			class="laptop:block laptop:px-0 laptop:pt-0 flex items-start justify-between gap-2 px-4 pt-4"
		>
			<FWTScrollAnimation
				direction="none"
				:duration-ms="820"
				:delay-ms="120"
			>
				<!-- COMPONENT: GeneralElectionCountdownSection -->
				<GeneralElectionCountdownSection />
			</FWTScrollAnimation>

			<FWTScrollAnimation
				direction="none"
				:duration-ms="820"
				:delay-ms="160"
			>
				<!-- COMPONENT: HomeBranchesBadge -->
				<HomeBranchesBadge />
			</FWTScrollAnimation>
		</div>

		<FWTScrollAnimation direction="none" :duration-ms="780">
			<!-- COMPONENT: CivicRepresentativeSearchSection -->
			<CivicRepresentativeSearchSection
				:title="civicRepresentativeSearchTitle"
				:placeholder="civicRepresentativeSearchPlaceholder"
				:filter-options="civicRepresentativeSearchFilterOptions"
				:default-selected-filters="civicRepresentativeSearchDefaultFilters"
			/>
		</FWTScrollAnimation>

		<FWTScrollAnimation direction="up" :distance="42" :duration-ms="900">
			<!-- COMPONENT: HomeHeroSection -->
			<HomeHeroSection />
		</FWTScrollAnimation>

		<FWTScrollAnimation direction="left" :distance="58" :duration-ms="940">
			<!-- COMPONENT: ApprovalRatingTierSection -->
			<ApprovalRatingTierSection />
		</FWTScrollAnimation>

		<FWTScrollAnimation
			direction="right"
			:distance="64"
			:duration-ms="980"
		>
			<!-- COMPONENT: CongressionalControlSection -->
			<CongressionalControlSection
				eyebrow="Congressional Balance"
				title="House & Senate Control"
				lead="Track the balance of power shaping the next fight in Congress."
				:chambers="congressionalControlChambers"
			/>
		</FWTScrollAnimation>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
