<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: AMERICA-IN-FOCUS > AMERICA_IN_FOCUS.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import {
	FWTScrollAnimation,
	FWTYouTubeVideoPlayer,
} from '../../components';
import CongressionalControlSection from '../../components/pages/america-in-focus/congressional/CongressionalControlSection.vue';
import HouseholdPriceSection from '../../components/pages/america-in-focus/household-prices/HouseholdPriceSection.vue';
import { UseAmericaInFocusPageComposable } from '../../components/pages/america-in-focus/america-in-focus-page-composables/UseAmericaInFocusPageComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const { americaInFocusVideoUrls, americaInFocusSectionShellStyleClasses } =
	UseAmericaInFocusPageComposable();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main class="relative min-h-screen bg-transparent text-slate-950">
		<FWTScrollAnimation direction="up" :distance="42" :duration-ms="900">
			<!-- ∞∞∞∞∞∞∞∞ CURRENT CONGRESSIONAL CONTROL ∞∞∞∞∞∞∞∞ -->
			<CongressionalControlSection
				eyebrow="America in Focus"
				title="House & Senate Control"
				lead="Track the balance of power shaping the next fight in Congress."
			/>

			<!-- ∞∞∞∞∞∞∞∞ HOUSEHOLD PRICE RESEARCH ∞∞∞∞∞∞∞∞ -->
			<div :class="americaInFocusSectionShellStyleClasses">
				<HouseholdPriceSection />
			</div>

			<!-- ∞∞∞∞∞∞∞∞ AMERICA IN FOCUS VIDEO PLAYER ∞∞∞∞∞∞∞∞ -->
			<div :class="americaInFocusSectionShellStyleClasses">
				<FWTYouTubeVideoPlayer
					:video-urls="americaInFocusVideoUrls"
					title="America in Focus"
					card-width-classes="laptop:w-3/4"
					carousel-navigation-color="#01A7FF"
				/>
			</div>
		</FWTScrollAnimation>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
