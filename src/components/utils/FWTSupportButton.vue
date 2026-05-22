<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS > FWT_SUPPORT_BUTTON.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type FWTSupportButtonProps = {
	label?: string;
	ariaLabel?: string;
	iconClass?: string;
	stripeDonationUrl?: string;
	openInNewTab?: boolean;
	rootClass?: string;
	disabled?: boolean;
};

const {
	label = 'Support us',
	ariaLabel = 'Donate to support this project',
	iconClass = 'pi pi-heart-fill',
	stripeDonationUrl,
	openInNewTab = false,
	rootClass,
	disabled = false,
} = defineProps<FWTSupportButtonProps>();

const emit = defineEmits<{
	click: [];
}>();
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// <FWTSupportButton @click="startStripeCheckout" />
//
// <FWTSupportButton
// 	label="Donate"
// 	aria-label="Donate to support the project"
// 	stripe-donation-url="https://buy.stripe.com/..."
// 	root-class="right-56"
// />
//
// The component also reads VITE_STRIPE_DONATION_URL, so the layout can mount it
// once and Stripe can be configured through env later. Listen to `click` only
// when the call site needs tracking before the donation redirect.
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const resolvedStripeDonationUrl = computed(() => {
	return stripeDonationUrl ?? import.meta.env.VITE_STRIPE_DONATION_URL ?? '/';
});

const supportButtonStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'fixed bottom-0 right-56 z-[70]',
			'flex cursor-pointer items-center gap-2 rounded-t-xl border px-4 py-2',
			'font-orbitron text-[0.65rem] font-black uppercase tracking-[0.18em]',
			'border-flipeffect-rose-bright/45 bg-flipeffect-ink/78',
			'text-flipeffect-presidential-white shadow-2xl',
			'shadow-flipeffect-rose/25 backdrop-blur-xl transition duration-300',
			'hover:-translate-y-1 hover:border-flipeffect-orange/70',
			'hover:bg-flipeffect-ink/90 hover:text-white',
			'hover:shadow-[0_0_28px_rgba(244,63,94,0.38)]',
			'active:translate-y-0 active:scale-95',
			'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0',
			'dark:border-flipeffect-rose-bright/30 dark:bg-slate-950/76',
			'dark:shadow-black/45',
			rootClass,
		),
	);
});

const handleSupportClick = () => {
	if (disabled) {
		return;
	}

	emit('click');

	if (openInNewTab) {
		window.open(
			resolvedStripeDonationUrl.value,
			'_blank',
			'noopener,noreferrer',
		);
		return;
	}

	window.location.assign(resolvedStripeDonationUrl.value);
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<button
		type="button"
		:class="supportButtonStyleClasses"
		:aria-label="ariaLabel"
		:disabled="disabled"
		@click="handleSupportClick"
	>
		<i :class="[iconClass, 'text-xs text-flipeffect-rose-bright']" aria-hidden="true" />
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
