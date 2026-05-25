<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS
    > FWT_DIRECTIONAL_STEPPER_ARROW_ICON.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed } from 'vue';

type FWTDirectionalStepperArrowIconDirection = 'previous' | 'next';

type FWTDirectionalStepperArrowIconProps = {
	direction: FWTDirectionalStepperArrowIconDirection;
};

const { direction } = defineProps<FWTDirectionalStepperArrowIconProps>();

const arrowPathData = computed(() => {
	if (direction === 'previous') {
		return 'M64.5833 100C64.5833 97.0833 65.4167 94.1667 67.5 92.0833L113.333 37.9167C117.917 32.5 125.833 32.0833 130.833 36.25C136.25 40.8333 136.667 48.75 132.5 53.75L93.3333 100L132.5 146.25C137.083 151.667 136.25 159.583 130.833 163.75C125.417 168.333 117.5 167.5 113.333 162.083L67.5 107.917C65.4167 105.833 64.5833 102.917 64.5833 100Z';
	}

	return 'M135.417 100C135.417 102.917 134.583 105.833 132.5 107.917L86.6667 162.083C82.0833 167.5 74.1667 167.917 69.1667 163.75C63.75 159.167 63.3333 151.25 67.5 146.25L106.667 100L67.5 53.75C62.9167 48.3333 63.75 40.4167 69.1667 36.25C74.5833 31.6667 82.5 32.5 86.6667 37.9167L132.5 92.0833C134.583 94.1667 135.417 97.0833 135.417 100Z';
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                 </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<svg
		viewBox="0 0 200 200"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path :d="arrowPathData"></path>
	</svg>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
