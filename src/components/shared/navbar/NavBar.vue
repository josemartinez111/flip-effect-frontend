<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!--            components/shared/navbar/NavBar.vue                    -->
<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->

<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref } from 'vue';
import { useNavLinks } from '../../../router/composables/useNavLinks.ts';
import NavBrand from './NavBrand.vue';
import NavCTAButton from './NavCTAButton.vue';
import NavHamburger from './NavHamburger.vue';
import SideDrawer from './SideDrawer.vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const drawerOpen = ref<boolean>(false);
const navLinks = useNavLinks();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const headerStyleClasses = twMerge(
	clsx(
		'fixed inset-x-0 top-0 z-50 h-16 border-b border-gray-200/60',
		'bg-white/80 backdrop-blur-md transition-colors duration-300',
		'dark:border-gray-800/60 dark:bg-gray-950/80',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
	<header :class="headerStyleClasses">
		<div
			class="tablet:px-6 mx-auto flex h-full items-center justify-between px-4"
		>
			<!-- --- Brand (left) --- -->
			<NavBrand />

			<!-- --- Actions (right) --- -->
			<div class="flex items-center gap-3">
				<!-- CTA: hidden on mobile, visible tablet+ -->
				<div class="tablet:block hidden">
					<NavCTAButton btn-title="Get Started" path="/" />
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
