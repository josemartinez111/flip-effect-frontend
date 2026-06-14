<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > DARKMODE_TOGGLE_SWITCH.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { storeToRefs } from 'pinia';
import { Sun, Moon } from '@lucide/vue';
import { computed } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UseDarkmodeStore } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const store = UseDarkmodeStore();
const { isDarkMode } = storeToRefs(store);

const getThemeToggleModeStyleClasses = ({
	lightModeStyleClasses,
	darkModeStyleClasses,
}: {
	lightModeStyleClasses: string;
	darkModeStyleClasses: string;
}) => {
	return isDarkMode.value ? darkModeStyleClasses : lightModeStyleClasses;
};

const themeToggleButtonBaseStyleClasses = twMerge(
	clsx(
		'group relative h-8 w-[5.8rem] cursor-pointer overflow-hidden rounded-full',
		'border backdrop-blur-md transition duration-300 hover:scale-[1.03] active:scale-95',
	),
);

const themeToggleButtonLightStyleClasses = twMerge(
	clsx(
		'border-white/52 bg-white/42 hover:border-amber-100/60',
		'shadow-[0_0_18px_rgba(251,191,36,0.12),inset_0_2px_8px_rgba(15,23,42,0.22),inset_0_-2px_5px_rgba(255,255,255,0.16)]',
	),
);

const themeToggleButtonDarkStyleClasses = twMerge(
	clsx(
		'border-cyan-100/18 bg-slate-950/48 hover:border-cyan-100/34',
		'shadow-[0_0_18px_rgba(103,232,249,0.12),inset_0_2px_8px_rgba(0,0,0,0.52),inset_0_-2px_5px_rgba(103,232,249,0.08)]',
	),
);

const themeToggleButtonStyleClasses = computed(() => {
	return twMerge(
		clsx(
			themeToggleButtonBaseStyleClasses,
			getThemeToggleModeStyleClasses({
				lightModeStyleClasses: themeToggleButtonLightStyleClasses,
				darkModeStyleClasses: themeToggleButtonDarkStyleClasses,
			}),
		),
	);
});

const themeToggleTrackLabelStyleClasses = twMerge(
	clsx(
		'absolute inset-y-0 flex items-center font-orbitron text-[0.48rem]',
		'font-black uppercase tracking-[0.1em] transition duration-300',
	),
);

const themeToggleTrackLightTextStyleClasses = twMerge(
	clsx('text-slate-950/44'),
);

const themeToggleTrackDarkTextStyleClasses = twMerge(
	clsx('text-cyan-100/44'),
);

const themeToggleTrackMutedLightTextStyleClasses = twMerge(
	clsx('text-slate-500/42'),
);

const themeToggleTrackMutedDarkTextStyleClasses = twMerge(
	clsx('text-slate-400/42'),
);

const themeToggleLightLabelStyleClasses = computed(() => {
	return twMerge(
		clsx(
			themeToggleTrackLabelStyleClasses,
			'left-2',
			getThemeToggleModeStyleClasses({
				lightModeStyleClasses: themeToggleTrackLightTextStyleClasses,
				darkModeStyleClasses: themeToggleTrackMutedDarkTextStyleClasses,
			}),
		),
	);
});

const themeToggleDarkLabelStyleClasses = computed(() => {
	return twMerge(
		clsx(
			themeToggleTrackLabelStyleClasses,
			'right-2',
			getThemeToggleModeStyleClasses({
				lightModeStyleClasses: themeToggleTrackMutedLightTextStyleClasses,
				darkModeStyleClasses: themeToggleTrackDarkTextStyleClasses,
			}),
		),
	);
});

const themeToggleGlowLightStyleClasses = twMerge(
	clsx('shadow-[0_0_22px_rgba(251,191,36,0.28)]'),
);

const themeToggleGlowDarkStyleClasses = twMerge(
	clsx('shadow-[0_0_22px_rgba(103,232,249,0.28)]'),
);

const themeToggleGlowStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute inset-0 rounded-full opacity-0 transition duration-300',
			'group-hover:opacity-100',
			getThemeToggleModeStyleClasses({
				lightModeStyleClasses: themeToggleGlowLightStyleClasses,
				darkModeStyleClasses: themeToggleGlowDarkStyleClasses,
			}),
		),
	);
});

const themeToggleSliderLightStyleClasses = twMerge(
	clsx(
		'translate-x-1 bg-amber-300 text-slate-950',
		'shadow-[0_0_18px_rgba(251,191,36,0.3),inset_0_0_0_1px_rgba(255,255,255,0.42),inset_0_2px_4px_rgba(255,255,255,0.45)]',
	),
);

const themeToggleSliderDarkStyleClasses = twMerge(
	clsx(
		'translate-x-[2.55rem] bg-slate-950 text-cyan-100',
		'shadow-[0_0_18px_rgba(103,232,249,0.28),inset_0_0_0_1px_rgba(103,232,249,0.2),inset_0_2px_4px_rgba(255,255,255,0.08)]',
	),
);

const themeToggleSliderStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute top-1 z-10 flex h-6 w-[3rem] items-center justify-center',
			'gap-1 rounded-full transition duration-300 ease-out',
			'group-hover:w-[3.08rem]',
			getThemeToggleModeStyleClasses({
				lightModeStyleClasses: themeToggleSliderLightStyleClasses,
				darkModeStyleClasses: themeToggleSliderDarkStyleClasses,
			}),
		),
	);
});

const themeToggleIconStyleClasses = twMerge(
	clsx(
		'h-2.5 w-2.5 shrink-0 transition duration-300',
		'group-hover:scale-110 group-hover:rotate-12',
	),
);

const themeToggleSliderLabelStyleClasses = twMerge(
	clsx('font-orbitron text-[0.44rem] font-black uppercase tracking-[0.08em]'),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
	<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
	<button
		type="button"
		:class="themeToggleButtonStyleClasses"
		:aria-pressed="isDarkMode"
		aria-label="Toggle color mode"
		@click="store.toggleDarkMode()"
	>
		<span :class="themeToggleGlowStyleClasses"></span>

		<span :class="themeToggleLightLabelStyleClasses">Light</span>
		<span :class="themeToggleDarkLabelStyleClasses">Dark</span>

		<span :class="themeToggleSliderStyleClasses">
			<Sun
				v-if="!isDarkMode"
				:class="themeToggleIconStyleClasses"
				:stroke-width="2.6"
			/>
			<Moon
				v-else
				:class="themeToggleIconStyleClasses"
				:stroke-width="2.6"
			/>
			<span :class="themeToggleSliderLabelStyleClasses">
				{{ isDarkMode ? 'Dark' : 'Light' }}
			</span>
		</span>
	</button>
	<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
