<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS > FWT_TRANSITION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
type FWTTransitionMode = 'in-out' | 'out-in' | 'default';

type FWTTransitionProps = {
	name?: string;
	mode?: FWTTransitionMode;
	appear?: boolean;
	enterFromClass?: string;
	enterActiveClass?: string;
	enterToClass?: string;
	leaveFromClass?: string;
	leaveActiveClass?: string;
	leaveToClass?: string;
	moveClass?: string;
};

const {
	name,
	mode = 'out-in',
	appear = false,
	enterFromClass = 'opacity-0 scale-95',
	enterActiveClass = 'transition duration-300 ease-out',
	enterToClass = 'opacity-100 scale-100',
	leaveFromClass = 'opacity-100 scale-100',
	leaveActiveClass = 'transition duration-200 ease-in',
	leaveToClass = 'opacity-0 scale-95',
	moveClass,
} = defineProps<FWTTransitionProps>();

defineSlots<{
	default(): unknown;
}>();
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Transition
		:name="name"
		:mode="mode === 'default' ? undefined : mode"
		:appear="appear"
		:enter-from-class="enterFromClass"
		:enter-active-class="enterActiveClass"
		:enter-to-class="enterToClass"
		:leave-from-class="leaveFromClass"
		:leave-active-class="leaveActiveClass"
		:leave-to-class="leaveToClass"
		:move-class="moveClass"
	>
		<slot />
	</Transition>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                     STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
