<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: HOME > HOME_PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { onMounted } from 'vue';
import {
	ApprovalRatingTierSection,
	CivicRepresentativeSearchSection,
	FWTScrollAnimation,
	GeneralElectionCountdownSection,
	HomeQuizBadge,
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
} = UseHomePageContentComposable();

const approvalStore = useApprovalStore();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Load the homepage approval snapshots after the page mounts. ---
onMounted(async () => {
	await approvalStore.fetchApprovalRatings();
});
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main :class="mainContainerStyleClasses">
		<!-- ∞∞∞∞∞∞∞∞ COUNTDOWN AND QUIZ ∞∞∞∞∞∞∞∞ -->
		<div
			class="laptop:block laptop:px-0 laptop:pt-0 flex items-start justify-between gap-2 px-4 pt-4"
		>
			<FWTScrollAnimation
				direction="none"
				:duration-ms="820"
				:delay-ms="120"
			>
				<!-- ∞∞∞∞∞∞∞∞ GENERAL ELECTION COUNTDOWN ∞∞∞∞∞∞∞∞ -->
				<GeneralElectionCountdownSection />
			</FWTScrollAnimation>

			<FWTScrollAnimation
				direction="none"
				:duration-ms="820"
				:delay-ms="160"
			>
				<!-- ∞∞∞∞∞∞∞∞ GOVERNMENT CHECKS AND BALANCES QUIZ ∞∞∞∞∞∞∞∞ -->
				<HomeQuizBadge />
			</FWTScrollAnimation>
		</div>

		<FWTScrollAnimation direction="none" :duration-ms="780">
			<!-- ∞∞∞∞∞∞∞∞ REPRESENTATIVE SEARCH ∞∞∞∞∞∞∞∞ -->
			<CivicRepresentativeSearchSection
				:title="civicRepresentativeSearchTitle"
				:placeholder="civicRepresentativeSearchPlaceholder"
				:filter-options="civicRepresentativeSearchFilterOptions"
				:default-selected-filters="civicRepresentativeSearchDefaultFilters"
			/>
		</FWTScrollAnimation>

		<FWTScrollAnimation direction="up" :distance="42" :duration-ms="900">
			<!-- ∞∞∞∞∞∞∞∞ HOME HERO ∞∞∞∞∞∞∞∞ -->
			<HomeHeroSection />
		</FWTScrollAnimation>

		<FWTScrollAnimation direction="left" :distance="58" :duration-ms="940">
			<!-- ∞∞∞∞∞∞∞∞ APPROVAL RATING STORY ∞∞∞∞∞∞∞∞ -->
			<ApprovalRatingTierSection />
		</FWTScrollAnimation>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
