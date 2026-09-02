<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > AUTH-SECTIONS
    > AUTH_SHELL.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	AuthCircuitArtwork,
	AuthLogoBackdrop,
	AuthPanelBackground,
} from '../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	title = 'Admin Access',
	shellClass,
	cardClass,
} = defineProps<{
	title?: string;
	shellClass?: string;
	cardClass?: string;
}>();

defineSlots<{
	default(): unknown;
}>();

const shellStyleClasses = twMerge(
	clsx(
		'flex min-h-screen w-full items-center justify-center bg-auth-blue',
		'px-4 py-8 text-white',
		shellClass,
	),
);

const cardStyleClasses = twMerge(
	clsx(
		'flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl',
		'border border-gray-700 bg-auth-blue shadow-2xl backdrop-blur-sm',
		'transition-all duration-200 tablet:flex-row',
		cardClass,
	),
);

const visualPanelStyleClasses = twMerge(
	clsx(
		'relative w-full min-h-[32rem] overflow-hidden rounded-bl-3xl p-8 text-white',
		'tablet:min-h-0 tablet:w-1/2 tablet:self-stretch tablet:p-12',
	),
);

const formPanelStyleClasses = twMerge(
	clsx(
		'relative flex w-full flex-col bg-auth-blue p-8',
		'text-gray-900 tablet:w-1/2 tablet:p-12 dark:text-gray-100',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main :class="shellStyleClasses">
		<section :class="cardStyleClasses" :aria-label="title">
			<aside :class="visualPanelStyleClasses" aria-hidden="true">
				<img
					:src="AuthLogoBackdrop"
					alt=""
					class="absolute inset-0 z-0 h-full w-full rotate-45 object-contain"
				/>
				<img
					:src="AuthCircuitArtwork"
					alt=""
					class="absolute inset-0 z-20 h-full w-full object-contain opacity-30 shadow-2xl"
				/>
				<img
					:src="AuthPanelBackground"
					alt=""
					class="absolute inset-0 z-0 h-full w-full object-contain"
				/>
				<div class="absolute inset-0 z-10 bg-black/50" />
				<h1 class="relative z-20 text-2xl leading-tight font-medium tracking-tight select-none tablet:text-3xl">
					<span class="text-transparent">
						ADMIN LOGIN
					</span>
				</h1>
			</aside>

			<section :class="formPanelStyleClasses">
				<slot />
			</section>
		</section>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
