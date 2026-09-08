<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > NAV_BAR.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
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
// --- Both menus share the route list; external backlinks stay in the drawer. ---
const desktopNavLinks = computed(() =>
	navLinks.filter((link) => !link.external),
);
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

const desktopNavStyleClasses = twMerge(
	clsx(
		'hidden flex-1 items-center justify-center gap-2 laptop:flex desktop:gap-5',
	),
);

const desktopNavLinkStyleClasses = twMerge(
	clsx(
		'cursor-pointer whitespace-nowrap rounded-lg px-3 py-2',
		'font-orbitron text-xs font-black uppercase tracking-wider',
		'text-slate-700 transition-colors duration-200 dark:text-slate-200',
		'hover:bg-flipeffect-sky/15 hover:text-flipeffect-sky',
		'aria-[current=page]:bg-flipeffect-sky/15 aria-[current=page]:text-flipeffect-sky',
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flipeffect-sky',
	),
);

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
	<header :class="headerStyleClasses">
		<div :class="navbarScrimStyleClasses"></div>

		<div :class="navbarContentStyleClasses">
			<!-- ∞∞∞∞∞∞∞∞ BRAND (LEFT) ∞∞∞∞∞∞∞∞ -->
			<NavBrand />

			<!-- ∞∞∞∞∞∞∞∞ LAPTOP / DESKTOP PAGE LINKS ∞∞∞∞∞∞∞∞ -->
			<nav :class="desktopNavStyleClasses" aria-label="Main navigation">
				<RouterLink
					v-for="link in desktopNavLinks"
					:key="link.path"
					:to="link.path"
					:class="desktopNavLinkStyleClasses"
				>
					{{ link.label }}
				</RouterLink>
			</nav>

			<!-- ∞∞∞∞∞∞∞∞ ACTIONS (RIGHT) ∞∞∞∞∞∞∞∞ -->
			<div class="flex items-center gap-3">
				<!-- ∞∞∞∞∞∞∞∞ DARK MODE TOGGLE: ALWAYS VISIBLE, HIDDEN ON PHONE LANDSCAPE ∞∞∞∞∞∞∞∞ -->
				<div class="phone-landscape:hidden block">
					<DarkmodeToggleSwitch />
				</div>

				<!-- ∞∞∞∞∞∞∞∞ HAMBURGER: ALWAYS VISIBLE ∞∞∞∞∞∞∞∞ -->
				<NavHamburger
					:ariaExpanded="drawerOpen"
					@click="drawerOpen = !drawerOpen"
				/>
			</div>
		</div>
	</header>

	<!-- ∞∞∞∞∞∞∞∞ SLIDE-IN DRAWER ∞∞∞∞∞∞∞∞ -->
	<SideDrawer
		:is-open="drawerOpen"
		:nav-links="navLinks"
		@close="drawerOpen = false"
	/>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
