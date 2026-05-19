<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS > FWT_BACK_TO_TOP_BANNER.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type FWTBackToTopBannerProps = {
	label?: string;
	ariaLabel?: string;
	rootClass?: string;
};

const {
	label = 'Back to top',
	ariaLabel = 'Scroll back to the top of the page',
	rootClass,
} = defineProps<FWTBackToTopBannerProps>();

const backToTopBannerStyleClasses = computed(() => {
	return twMerge(
			clsx(
				'fixed bottom-0 right-8 z-[70]',
			'flex cursor-pointer items-center gap-2 rounded-t-xl border px-4 py-2',
			'font-orbitron text-[0.65rem] font-black uppercase tracking-[0.18em]',
			'border-cyan-200/45 bg-slate-950/72 text-cyan-100 shadow-2xl',
			'shadow-cyan-950/25 backdrop-blur-xl transition duration-300',
			'hover:-translate-y-1 hover:border-cyan-100/70 hover:bg-slate-950/88',
			'hover:text-white hover:shadow-[0_0_28px_rgba(34,211,238,0.34)]',
			'active:translate-y-0 active:scale-95',
			'dark:border-cyan-100/20 dark:bg-slate-950/74 dark:shadow-black/45',
			rootClass,
		),
	);
});

const scrollBackToTop = () => {
	const reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	window.scrollTo({
		top: 0,
		behavior: reducedMotion ? 'auto' : 'smooth',
	});
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<button
		type="button"
		:class="backToTopBannerStyleClasses"
		:aria-label="ariaLabel"
		@click="scrollBackToTop"
	>
		<i class="pi pi-arrow-up text-xs" aria-hidden="true" />
		<span>{{ label }}</span>
	</button>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                     STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
