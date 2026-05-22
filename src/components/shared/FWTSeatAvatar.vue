<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED
    > FWT_SEAT_AVATAR.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type FWTSeatAvatarSize = 'small' | 'medium' | 'large';

type FWTSeatAvatarProps = {
	seatAvatarSize?: FWTSeatAvatarSize;
	iconStyleClasses?: string;
	rootStyleClasses?: string;
	seatBackStyleClasses?: string;
	seatHeadStyleClasses?: string;
	seatBaseStyleClasses?: string;
	ariaLabel?: string;
	hideIcon?: boolean;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// <FWTSeatAvatar
// 	seat-avatar-size="small"
// 	icon-style-classes="pi pi-user"
// 	seat-back-style-classes="border-cyan-200/70 bg-blue-700"
// 	seat-head-style-classes="border-cyan-100/80 bg-cyan-200 text-blue-950"
// 	seat-base-style-classes="bg-blue-950/80"
// 	aria-label="Democratic seat"
// />
//
// Use `v-bind` with a style map when a caller needs several color themes:
// <FWTSeatAvatar v-bind="seatAvatarStyleClassesByType[seat.type]" />
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const {
	seatAvatarSize = 'small',
	iconStyleClasses = 'pi pi-user',
	rootStyleClasses,
	seatBackStyleClasses,
	seatHeadStyleClasses,
	seatBaseStyleClasses,
	ariaLabel,
	hideIcon = false,
} = defineProps<FWTSeatAvatarProps>();

const seatAvatarSizeMap: Record<
	FWTSeatAvatarSize,
	{
		root: string;
		back: string;
		head: string;
		icon: string;
		base: string;
	}
> = {
	small: {
		root: 'h-5 w-3.5',
		back: 'h-4 w-3',
		head: 'h-2.5 w-2.5',
		icon: 'text-[0.32rem]',
		base: 'h-1 w-3.5',
	},
	medium: {
		root: 'h-6 w-4.5',
		back: 'h-5 w-4',
		head: 'h-3.5 w-3.5',
		icon: 'text-[0.42rem]',
		base: 'h-1.5 w-4.5',
	},
	large: {
		root: 'h-8 w-6',
		back: 'h-6.5 w-5',
		head: 'h-4.5 w-4.5',
		icon: 'text-[0.52rem]',
		base: 'h-2 w-6',
	},
};

const seatAvatarSizeClasses = computed(() => {
	return seatAvatarSizeMap[seatAvatarSize];
});

const seatAvatarRootStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'relative inline-flex shrink-0 cursor-pointer items-end justify-center',
			'transition duration-200 hover:z-10 hover:scale-125',
			seatAvatarSizeClasses.value.root,
			rootStyleClasses,
		),
	);
});

const seatAvatarBackStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute bottom-[10%] left-1/2 -translate-x-1/2',
			'rounded-t-[0.5rem] border shadow-sm',
			'border-slate-300/55 bg-slate-600/58 shadow-slate-500/10',
			seatAvatarSizeClasses.value.back,
			seatBackStyleClasses,
		),
	);
});

const seatAvatarHeadStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center',
			'rounded-full border shadow-sm',
			'border-slate-300/55 bg-slate-400/45 text-slate-700/60 shadow-none',
			seatAvatarSizeClasses.value.head,
			seatHeadStyleClasses,
		),
	);
});

const seatAvatarIconStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'leading-none',
			seatAvatarSizeClasses.value.icon,
			hideIcon && 'opacity-0',
			iconStyleClasses,
		),
	);
});

const seatAvatarBaseStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-sm',
			'bg-slate-500/40',
			seatAvatarSizeClasses.value.base,
			seatBaseStyleClasses,
		),
	);
});

const seatAvatarLabel = computed(() => {
	return ariaLabel ?? 'Seat avatar';
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<span
		:class="seatAvatarRootStyleClasses"
		:aria-label="seatAvatarLabel"
		role="img"
	>
		<span :class="seatAvatarBackStyleClasses" aria-hidden="true" />
		<span :class="seatAvatarHeadStyleClasses" aria-hidden="true">
			<i :class="seatAvatarIconStyleClasses" />
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
