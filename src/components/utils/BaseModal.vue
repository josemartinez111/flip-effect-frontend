<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS > BASE_MODAL.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import Dialog from 'primevue/dialog';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Older manual version this replaces:
// const { visible } = defineProps<{ visible: boolean }>();
// const emit = defineEmits<{ 'update:visible': [value: boolean] }>();
// emit('update:visible', false);
// -------------------------------------------------------------------
// New version:
// const visible = defineModel<boolean>('visible', { default: false });
// visible.value = false;
//
// This gives the component a writable visible ref and keeps the two-way
// binding contract obvious without manually wiring update emits.
// Vue 3.4+ two-way binding shortcut for named v-model values.

// Parent usage:
// const threeBranchesModalOpen = ref(false);
// <BaseModal v-model:visible="threeBranchesModalOpen" />
// ---
const visible = defineModel<boolean>('visible', {
	default: false,
});

type ModalProps = {
	header?: string;
	modal?: boolean;
	closable?: boolean;
	dismissableMask?: boolean;
	closeOnEscape?: boolean;
	blockScroll?: boolean;
	draggable?: boolean;
	appendTo?: 'body' | 'self' | string;
};

const {
	header,
	modal = true,
	closable = true,
	dismissableMask = true,
	closeOnEscape = true,
	blockScroll = true,
	draggable = false,
	appendTo = 'body',
} = defineProps<ModalProps>();

const emit = defineEmits<{
	show: [];
	hide: [];
	'after-hide': [];
}>();

const slots = defineSlots<{
	default(): unknown;
	header?(): unknown;
	footer?(): unknown;
}>();
// ---
// Parent usage example:
// const approvalDetailsModalOpen = ref(false);
//
// <button type="button" @click="approvalDetailsModalOpen = true">
//  View Details
// </button>
//
// <BaseModal
//  v-model:visible="approvalDetailsModalOpen"
//  header="Approval Rating Details"
// >
//  <ApprovalRatingDetails />
// </BaseModal>
//
// Use the default slot for the child component. Add #footer only when the
// modal wrapper should own actions such as Save, Cancel, Delete, or Confirm.
// ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const showHeader = computed(() =>
	Boolean(header || slots.header || closable),
);

const modalRootStyleClasses = twMerge(
	clsx(
		'w-[min(96vw,78rem)] overflow-hidden rounded-xl',
		'border border-surface-200/70 bg-white text-slate-950 shadow-2xl',
		'shadow-slate-950/20 dark:border-white/10 dark:bg-surface-950',
		'dark:text-white dark:shadow-black/50',
	),
);

const modalMaskStyleClasses = twMerge(
	clsx('bg-slate-950/48 backdrop-blur-sm dark:bg-black/62'),
);

const modalHeaderStyleClasses = twMerge(
	clsx('border-b border-surface-200/70 px-5 py-4', 'dark:border-white/10'),
);

const modalTitleStyleClasses = twMerge(
	clsx(
		'font-orbitron text-base font-black tracking-normal tablet:text-lg',
	),
);

const modalContentStyleClasses = twMerge(
	clsx('max-h-[min(86vh,58rem)] overflow-hidden px-3 py-3'),
);

const modalFooterStyleClasses = twMerge(
	clsx('border-t border-surface-200/70 px-5 py-4', 'dark:border-white/10'),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Dialog
		v-model:visible="visible"
		:append-to="appendTo"
		:block-scroll="blockScroll"
		:closable="closable"
		:close-on-escape="closeOnEscape"
		:dismissable-mask="dismissableMask"
		:draggable="draggable"
		:header="header"
		:modal="modal"
		:show-header="showHeader"
		:pt="{
			root: { class: modalRootStyleClasses },
			mask: { class: modalMaskStyleClasses },
			header: { class: modalHeaderStyleClasses },
			title: { class: modalTitleStyleClasses },
			content: { class: modalContentStyleClasses },
			footer: { class: modalFooterStyleClasses },
		}"
		@show="emit('show')"
		@hide="emit('hide')"
		@after-hide="emit('after-hide')"
	>
		<template v-if="$slots.header" #header>
			<slot name="header" />
		</template>

		<!-- Default slot for child component -->
		<slot />

		<template v-if="$slots.footer" #footer>
			<slot name="footer" />
		</template>
	</Dialog>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
