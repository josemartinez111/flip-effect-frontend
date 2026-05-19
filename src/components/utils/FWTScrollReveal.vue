<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS > FWT_SCROLL_REVEAL.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	type CSSProperties,
} from 'vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type FWTScrollRevealDirection =
	| 'up'
	| 'down'
	| 'left'
	| 'right'
	| 'scale'
	| 'none';

type FWTScrollRevealProps = {
	direction?: FWTScrollRevealDirection;
	distance?: number;
	durationMs?: number;
	delayMs?: number;
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
	disabled?: boolean;
	initialScale?: number;
	blur?: boolean;
	wrapperClass?: string;
};

const {
	direction = 'up',
	distance = 56,
	durationMs = 780,
	delayMs = 0,
	threshold = 0.1,
	rootMargin = '-50px',
	once = false,
	disabled = false,
	initialScale = 1,
	blur = false,
	wrapperClass,
} = defineProps<FWTScrollRevealProps>();

defineSlots<{
	default(): unknown;
}>();

const revealElementRef = ref<HTMLElement | null>(null);
const revealVisible = ref(false);
let revealObserver: IntersectionObserver | undefined;

const getHiddenTransform = () => {
	if (direction === 'none') {
		return 'none';
	}

	if (direction === 'scale') {
		return `scale(${initialScale})`;
	}

	if (direction === 'up') {
		return `translate3d(0, ${distance}px, 0) scale(${initialScale})`;
	}

	if (direction === 'down') {
		return `translate3d(0, -${distance}px, 0) scale(${initialScale})`;
	}

	if (direction === 'left') {
		return `translate3d(-${distance}px, 0, 0) scale(${initialScale})`;
	}

	return `translate3d(${distance}px, 0, 0) scale(${initialScale})`;
};

const revealRootStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'transform-gpu backface-hidden will-change-[opacity,transform]',
			blur && 'will-change-[opacity,transform,filter]',
			revealVisible.value && 'will-change-auto',
			wrapperClass,
		),
	);
});

const revealRootStyle = computed<CSSProperties>(() => {
	const visible = disabled || revealVisible.value;

	return {
		opacity: visible ? '1' : '0',
		transform: visible
			? 'translate3d(0, 0, 0) scale(1)'
			: getHiddenTransform(),
		filter: blur ? (!visible ? 'blur(2px)' : 'blur(0)') : undefined,
		transitionProperty: blur
			? 'opacity, transform, filter'
			: 'opacity, transform',
		transitionDuration: `${durationMs}ms`,
		transitionDelay: visible ? `${delayMs}ms` : '0ms',
		transitionTimingFunction: 'ease-in-out',
	};
});

onMounted(() => {
	const reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	if (disabled || reducedMotion) {
		revealVisible.value = true;
		return;
	}

	revealObserver = new IntersectionObserver(
		([entry]) => {
			if (!entry) {
				return;
			}

			if (entry.isIntersecting) {
				revealVisible.value = true;

				if (once) {
					revealObserver?.disconnect();
				}

				return;
			}

			if (!once) {
				revealVisible.value = false;
			}
		},
		{
			rootMargin,
			threshold,
		},
	);

	if (revealElementRef.value) {
		revealObserver.observe(revealElementRef.value);
	}
});

onUnmounted(() => {
	revealObserver?.disconnect();
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div
		ref="revealElementRef"
		:class="revealRootStyleClasses"
		:style="revealRootStyle"
	>
		<slot />
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                     STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
