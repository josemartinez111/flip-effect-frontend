<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > NAV_BAR.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref } from 'vue';
import { UseNavLinksComposable } from '../../../router/composables/UseNavLinksComposable.ts';
import NavBrand from './NavBrand.vue';
import DarkmodeToggleSwitch from './DarkmodeToggleSwitch.vue';
import NavHamburger from './NavHamburger.vue';
import SideDrawer from './SideDrawer.vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const drawerOpen = ref<boolean>(false);
const navLinks = UseNavLinksComposable();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const headerStyleClasses = twMerge(
	clsx(
		'fixed inset-x-0 top-0 z-50 isolate h-16 overflow-hidden border-0 bg-transparent',
		'shadow-none ring-0 transition-colors duration-300',
	),
);

const navbarScrimStyleClasses = twMerge(
	clsx(
		'pointer-events-none absolute inset-0 z-0',
		'backdrop-blur-md',
		'bg-[linear-gradient(180deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.34)_46%,rgba(255,255,255,0)_100%)]',
		'shadow-[0_10px_28px_rgba(15,23,42,0.08)]',
		'dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.54)_0%,rgba(2,6,23,0.28)_52%,rgba(2,6,23,0)_100%)]',
		'dark:shadow-[0_10px_32px_rgba(0,0,0,0.24)]',
	),
);

const navbarContentStyleClasses = twMerge(
	clsx(
		'relative z-10 mx-auto flex h-full items-center justify-between',
		'px-4 tablet:px-6',
	),
);

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
	<header :class="headerStyleClasses">
		<div :class="navbarScrimStyleClasses"></div>

		<div :class="navbarContentStyleClasses">
			<!-- --- Brand (left) --- -->
			<NavBrand />

			<!-- --- Actions (right) --- -->
			<div class="flex items-center gap-3">
				<!-- --- Dark mode toggle: always visible, hidden on phone landscape --- -->
				<div class="block phone-landscape:hidden">
					<DarkmodeToggleSwitch />
				</div>

				<!-- Hamburger: always visible -->
				<NavHamburger
					:ariaExpanded="drawerOpen"
					@click="drawerOpen = !drawerOpen"
				/>
			</div>
		</div>
	</header>

	<!-- --- Slide-in drawer --- -->
	<SideDrawer
		:is-open="drawerOpen"
		:nav-links="navLinks"
		@close="drawerOpen = false"
	/>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
