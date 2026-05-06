<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > FOOTER
    > FOOTER.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Divider from 'primevue/divider';
import { twMerge } from 'tailwind-merge';
import { formatDate } from '../../../lib';
import { FlipEffectLogo } from '../../../assets';
import clsx from 'clsx';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

interface FooterLink {
	label: string;
	href: string;
}

interface FooterSection {
	title: string;
	links: FooterLink[];
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const currentYear = formatDate('year');

const sections: FooterSection[] = [
	{
		title: 'Product',
		links: [
			{ label: 'Features', href: '#' },
			{ label: 'Pricing', href: '#' },
			{ label: 'Changelog', href: '#' },
		],
	},
	{
		title: 'Company',
		links: [
			{ label: 'About', href: '#' },
			{ label: 'Blog', href: '#' },
			{ label: 'Careers', href: '#' },
		],
	},
	{
		title: 'Legal',
		links: [
			{ label: 'Privacy', href: '#' },
			{ label: 'Terms', href: '#' },
		],
	},
];
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const sectionsStyleClasses = twMerge(
	clsx(
		'text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900',
		' dark:hover:text-white transition-colors duration-150',
	),
);

const footerBrandLinkStyleClasses = twMerge(
	clsx(
		'flex shrink-0 rounded-full transition duration-150 ease-out',
		'hover:scale-[1.04] hover:opacity-90 active:scale-95 active:opacity-75',
		'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flipeffect-sky',
	),
);

const footerLogoStyleClasses = twMerge(
	clsx('max-w-12 rounded-full object-contain'),
);
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<footer
		class="w-full bg-white/80 backdrop-blur-md transition-colors duration-300 dark:bg-gray-950/80"
	>
		<!-- ∞∞∞∞∞∞∞∞ TOP DIVIDER ∞∞∞∞∞∞∞∞ -->
		<Divider class="m-0! border-slate-200! dark:border-slate-700/60!" />

		<!-- ∞∞∞∞∞∞∞∞ LINK SECTIONS ∞∞∞∞∞∞∞∞ -->
		<div class="mx-auto max-w-7xl px-6 py-12">
			<div class="mb-10 grid grid-cols-2 gap-10 md:grid-cols-4">
				<!-- --- Brand column --- -->
				<div class="col-span-2 flex flex-col gap-3 md:col-span-1">
					<div class="flex items-center gap-3">
						<RouterLink to="/" :class="footerBrandLinkStyleClasses">
							<img
								:src="FlipEffectLogo"
								alt="The Flip Effect Logo"
								:class="footerLogoStyleClasses"
							/>
						</RouterLink>
						<p class="text-xs text-slate-400 dark:text-slate-500">
							&copy; {{ currentYear }} The Flip Effect. All rights reserved.
						</p>
					</div>
				</div>

				<!-- --- Link sections --- -->
				<div
					v-for="section in sections"
					:key="section.title"
					class="flex flex-col gap-3"
				>
					<span
						class="text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500"
					>
						{{ section.title }}
					</span>
					<ul class="flex flex-col gap-2">
						<li v-for="link in section.links" :key="link.label">
							<a :href="link.href" :class="sectionsStyleClasses">
								{{ link.label }}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- ∞∞∞∞∞∞∞∞ BOTTOM DIVIDER (full width) ∞∞∞∞∞∞∞∞ -->
		<Divider class="m-0! border-slate-200! dark:border-slate-700/60!" />
	</footer>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
