<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > DARKMODE_TOGGLE_SWITCH.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { storeToRefs } from 'pinia';
import { Sun, Moon } from '@lucide/vue';
import { UseDarkmodeStore } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const store = UseDarkmodeStore();
const { isDarkMode } = storeToRefs(store);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
	<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
	<button
		class="group tablet:h-[1.8rem] tablet:w-16 relative flex h-[1.8rem] w-14 cursor-pointer items-center justify-between rounded-full bg-gray-300 p-0.5 dark:bg-gray-700"
		aria-label="Toggle dark mode"
		@click="store.toggleDarkMode()"
	>
		<!-- --- Sliding indicator circle --- -->
		<div
			class="tablet:h-7 tablet:w-7 absolute h-6 w-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
			:class="
				isDarkMode
					? 'tablet:translate-x-8 translate-x-7 bg-blue-950'
					: 'translate-x-0 bg-amber-400'
			"
		/>

		<!-- --- Sun / Moon icons --- -->
		<div class="relative z-10 flex w-full items-center justify-between">
			<Sun
				class="tablet:h-5 tablet:w-5 h-4 w-4 pl-2 transition-colors duration-300"
				:class="isDarkMode ? 'text-gray-400' : 'text-white'"
				:stroke-width="isDarkMode ? 2 : 2.5"
			/>
			<Moon
				class="tablet:h-5 tablet:w-5 h-4 w-4 pr-1 transition-colors duration-300"
				:class="isDarkMode ? 'text-white' : 'text-gray-400'"
				:stroke-width="isDarkMode ? 2.5 : 2"
			/>
		</div>
	</button>
	<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
