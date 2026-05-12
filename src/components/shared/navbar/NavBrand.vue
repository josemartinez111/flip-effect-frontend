<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > NAV_BRAND.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { FlipEffectLogo } from '../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const brandLinkStyleClasses = twMerge(
	clsx(
		'flex items-center gap-3 tablet:gap-5',
		'rounded-full transition duration-150 ease-out',
		'hover:scale-[1.02] hover:opacity-90 active:scale-95 active:opacity-75',
		'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flipeffect-sky',
	),
);

const logoStyleClasses = twMerge(
	clsx('ml-2 max-w-10 rounded-full object-contain tablet:max-w-14'),
);

const brandTextContainerStyleClasses = twMerge(
	clsx(
		'relative flex py-4 font-orbitron font-extrabold whitespace-nowrap',
	),
);

const brandSharedTextStyleClasses = twMerge(
	clsx('text-sm tracking-wide tablet:text-base laptop:text-xl'),
);

const brandGlowStyleClasses = twMerge(
	clsx(
		brandSharedTextStyleClasses,
		'absolute mx-auto w-fit select-none blur-xl',
		'bg-gradient-to-r from-flipeffect-ink via-flipeffect-rose to-flipeffect-sky',
		'bg-clip-text text-transparent opacity-70',
		'dark:from-flipeffect-cyan dark:via-flipeffect-rose-bright dark:to-flipeffect-sky',
	),
);

const brandTextStyleClasses = twMerge(
	clsx(brandSharedTextStyleClasses, 'relative h-auto w-fit select-auto'),
);

const brandPrefixStyleClasses = twMerge(
	clsx('text-slate-950 dark:text-white'),
);

const brandFlipStyleClasses = twMerge(
	clsx(
		'bg-gradient-to-r from-flipeffect-flip to-flipeffect-orange bg-clip-text text-transparent',
	),
);

const brandEffectStyleClasses = twMerge(
	clsx(
		'bg-gradient-to-r from-slate-950 via-sky-700 to-cyan-500 bg-clip-text text-transparent',
		'drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]',
		'dark:from-white dark:via-cyan-100 dark:to-sky-300',
		'dark:drop-shadow-[0_0_18px_rgba(125,211,252,1)]',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
	<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
	<RouterLink to="/" :class="brandLinkStyleClasses">
		<!-- --- Placeholder logo --- -->
		<img
			:src="FlipEffectLogo"
			alt="The Flip Effect Logo"
			:class="logoStyleClasses"
		/>

		<!-- --- Gradient Orbitron text with glow behind --- -->
		<div :class="brandTextContainerStyleClasses">
			<span :class="brandGlowStyleClasses" aria-hidden="true">
				TheFlipEffect
			</span>
			<h1 :class="brandTextStyleClasses">
				<span :class="brandPrefixStyleClasses">The</span>
				<span :class="brandFlipStyleClasses">Flip</span>
				<span :class="brandEffectStyleClasses">Effect</span>
			</h1>
		</div>
	</RouterLink>
	<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
