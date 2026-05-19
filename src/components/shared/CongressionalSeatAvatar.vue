<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > CONGRESSIONAL
    > CONGRESSIONAL_SEAT_AVATAR.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type CongressionalSeatAvatarParty =
	| 'democrat'
	| 'republican'
	| 'independent'
	| 'vacant';

type CongressionalSeatAvatarSize = 'house' | 'senate';

type CongressionalSeatAvatarProps = {
	party: CongressionalSeatAvatarParty;
	size?: CongressionalSeatAvatarSize;
	iconClass?: string;
	ariaLabel?: string;
};

const {
	party,
	size = 'house',
	iconClass = 'pi pi-user',
	ariaLabel,
} = defineProps<CongressionalSeatAvatarProps>();

const seatAvatarRootStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'relative inline-flex shrink-0 cursor-pointer items-end justify-center',
			'transition duration-200 hover:z-10 hover:scale-125',
			size === 'house' ? 'h-5 w-3.5' : 'h-6 w-4.5',
		),
	);
});

const seatAvatarBackStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute bottom-[10%] left-1/2 -translate-x-1/2',
			'rounded-t-[0.5rem] border shadow-sm',
			size === 'house' ? 'h-4 w-3' : 'h-5 w-4',
			party === 'democrat' &&
				'border-cyan-200/70 bg-blue-700 shadow-blue-500/35',
			party === 'republican' &&
				'border-rose-200/70 bg-rose-800 shadow-rose-500/35',
			party === 'independent' &&
				'border-violet-200/70 bg-violet-700 shadow-violet-500/35',
			party === 'vacant' &&
				'border-slate-300/55 bg-slate-600/58 shadow-slate-500/10',
		),
	);
});

const seatAvatarHeadStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center',
			'rounded-full border shadow-sm',
			size === 'house' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
			party === 'democrat' &&
				'border-cyan-100/80 bg-cyan-200 text-blue-950 shadow-cyan-300/40',
			party === 'republican' &&
				'border-rose-100/80 bg-rose-200 text-rose-950 shadow-rose-300/40',
			party === 'independent' &&
				'border-violet-100/80 bg-violet-200 text-violet-950 shadow-violet-300/40',
			party === 'vacant' &&
				'border-slate-300/55 bg-slate-400/45 text-slate-700/60 shadow-none',
		),
	);
});

const seatAvatarIconStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'leading-none',
			size === 'house' ? 'text-[0.32rem]' : 'text-[0.42rem]',
			party === 'vacant' && 'opacity-0',
		),
	);
});

const seatAvatarBaseStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-sm',
			size === 'house' ? 'h-1 w-3.5' : 'h-1.5 w-4.5',
			party === 'democrat' && 'bg-blue-950/80',
			party === 'republican' && 'bg-rose-950/80',
			party === 'independent' && 'bg-violet-950/80',
			party === 'vacant' && 'bg-slate-500/40',
		),
	);
});

const seatAvatarLabel = computed(() => {
	if (ariaLabel) {
		return ariaLabel;
	}

	return `${party} congressional seat`;
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<span :class="seatAvatarRootStyleClasses" :aria-label="seatAvatarLabel">
		<span :class="seatAvatarBackStyleClasses" aria-hidden="true" />
		<span :class="seatAvatarHeadStyleClasses" aria-hidden="true">
			<i :class="[iconClass, seatAvatarIconStyleClasses]" />
		</span>
		<span :class="seatAvatarBaseStyleClasses" aria-hidden="true" />
	</span>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
