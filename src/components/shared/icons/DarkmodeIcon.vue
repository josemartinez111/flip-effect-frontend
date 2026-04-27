<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
          COMPONENTS > ICONS > DARKMODE_ICON.VUE 
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { UseDarkmodeStore } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type SVGIconProps = {
	height?: string;
	width?: string;
	customClass?: string;
	iconColor?: string;
	isDarkMode?: boolean;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	height = '28',
	width = '28',
	customClass = '',
} = defineProps<SVGIconProps>();

const store = UseDarkmodeStore();
const { isDarkMode } = storeToRefs(store);

const computeIconClass = (iconType: 'moon' | 'sun') =>
	computed(() => {
		const colStart = iconType === 'sun' ? 'col-start-1' : 'col-start-2';
		const baseClasses = `${colStart} row-start-1 flex justify-center items-center`;
		return baseClasses; // Only layout, no color-related classes
	});

const sunIconClass = computeIconClass('sun');
const moonIconClass = computeIconClass('moon');
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div>
		<label class="grid cursor-pointer place-items-center pt-3 pr-6 pl-10">
			<input
				type="checkbox"
				value="synthwave"
				:class="[
					'toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1',
					isDarkMode ? 'bg-[#52A9FF]' : 'bg-[#e11d48]',
					customClass,
				]"
				:height="`${height}px`"
				:width="`${width}px`"
				:checked="isDarkMode"
				@change="store.toggleDarkMode()"
			/>
			<!-- SUN-SVG -->
			<svg
				:class="sunIconClass"
				:height="`${height}px`"
				xmlns="http://www.w3.org/2000/svg"
				:width="`${width}px`"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="5" />
				<path
					d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4
            18.4l1.4 1.4M1 12h2M21 12h2M4.2
            19.8l1.4-1.4M18.4 5.6l1.4-1.4"
				/>
			</svg>
			<!-- MOON-SVG -->
			<svg
				:class="moonIconClass"
				xmlns="http://www.w3.org/2000/svg"
				:height="`${height}px`"
				:width="`${width}px`"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		</label>
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
