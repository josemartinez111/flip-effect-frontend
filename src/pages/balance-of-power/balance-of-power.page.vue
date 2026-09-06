<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: BALANCE-OF-POWER > BALANCE_OF_POWER.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	FWTScrollAnimation,
	FWTYouTubeVideoPlayer,
} from '../../components';
import CongressionalControlSection from '../../components/pages/balance-of-power/congressional/CongressionalControlSection.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const YOUTUBE_VIDEO_URLS: Array<string> = [
	'https://youtu.be/lfr9ZQfcU34?si=0s8uVmRI3cYeFy-Z',
	'https://youtu.be/E02Sbj32_Vc?si=vORAWMFkFJQYsbrn',
	'https://youtu.be/KHbYD0UQ0HI?si=XSrMEIwCsYudjSF-',
	'https://youtu.be/K_xy4UJIIek?si=XzFxUl0ZNE2J_d8F',
	'https://youtu.be/QBiPleGSlFQ?si=zqr3Bj1FOANI9u5a',
];

// --- Matches the control section gutters so the player card never runs edge to edge on a phone. ---
const videoPlayerShellStyleClasses = twMerge(
	clsx(
		'relative z-20 mx-auto w-full max-w-[96rem] px-4 pb-10',
		'tablet:px-6 tablet:pb-14 laptop:pb-20',
	),
);
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main class="relative min-h-screen bg-transparent text-slate-950">
		<FWTScrollAnimation direction="up" :distance="42" :duration-ms="900">
			<!-- ∞∞∞∞∞∞∞∞ CURRENT CONGRESSIONAL CONTROL ∞∞∞∞∞∞∞∞ -->
			<CongressionalControlSection
				eyebrow="Balance of Power"
				title="House & Senate Control"
				lead="Track the balance of power shaping the next fight in Congress."
			/>

			<!-- ∞∞∞∞∞∞∞∞ BALANCE OF POWER VIDEO PLAYER ∞∞∞∞∞∞∞∞ -->
			<div :class="videoPlayerShellStyleClasses">
				<FWTYouTubeVideoPlayer
					:video-urls="YOUTUBE_VIDEO_URLS"
					title="The Balance of Power in Congress"
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
