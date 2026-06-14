<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > NAV_BAR.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, ref } from 'vue';
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

const epsteinFilesNavLink = computed(() => {
	return navLinks.find((link) => {
		return link.label === 'Epstein Files';
	});
});
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

const epsteinFilesLinkStyleClasses = twMerge(
	clsx(
		'hidden cursor-pointer rounded-full border px-4 py-2',
		'font-orbitron text-[0.65rem] font-black! uppercase tracking-[0.16em]',
		'border-slate-950/12 bg-white/42 text-slate-950 shadow-lg',
		'shadow-slate-950/8 backdrop-blur-md transition duration-200',
		'hover:border-flipeffect-cyan/60 hover:bg-flipeffect-cyan/18',
		'hover:text-slate-950 tablet:inline-flex',
		'dark:border-white/12 dark:bg-slate-950/48 dark:text-white',
		'dark:shadow-black/25 dark:hover:border-flipeffect-cyan/70',
		'dark:hover:bg-flipeffect-cyan/14 dark:hover:text-flipeffect-cyan',
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
				<a
					v-if="epsteinFilesNavLink"
					:href="epsteinFilesNavLink.path"
					:class="epsteinFilesLinkStyleClasses"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ epsteinFilesNavLink.label }}
				</a>

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
