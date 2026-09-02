<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > NAVBAR
    > SIDE_DRAWER.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { NavLinkType } from '../../../router/composables/UseNavLinksComposable.ts';
import NavBrand from './NavBrand.vue';
import DarkmodeToggleSwitch from './DarkmodeToggleSwitch.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const { isOpen, navLinks } = defineProps<{
  isOpen: boolean;
  navLinks: NavLinkType[];
}>();

const emit = defineEmits<{ close: [] }>();

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const router = useRouter();

const externalNavLinks = computed(() => {
  return navLinks.filter((link) => {
    return link.external;
  });
});

const internalNavLinks = computed(() => {
  return navLinks.filter((link) => {
    return !link.external;
  });
});

// --- Bridge one-way prop → PrimeVue two-way v-model:visible ---
const visible = computed({
  get: () => isOpen,
  set: (val) => { if (!val) { emit('close'); } },
});

const navigateTo = (path: string): void => {
  router.push(path);
  emit('close');
};

const handleExternalLinkClick = (): void => {
  emit('close');
};

// --- Single concave / sunken container holding all backlink sites: inset shadow gives the pressed-in look (per the provided CSS). ---
// --- App routes share the backlink hover language: grow + bright sky (replaces PrimeVue's default green). ---
const appLinkStyleClasses = twMerge(
  clsx(
    'w-full! origin-left cursor-pointer justify-start! rounded-lg bg-transparent!',
    'font-orbitron! text-sm! font-black! uppercase! tracking-[0.12em]!',
    '[&_.p-button-label]:font-black!',
    'text-gray-700! transition duration-200 ease-out dark:text-gray-200!',
    'hover:scale-110 hover:bg-flipeffect-sky/15! hover:text-flipeffect-sky!',
    'active:scale-105',
  ),
);

const concaveBacklinkContainerStyleClasses = twMerge(
  clsx(
    'flex flex-col gap-1 rounded-[1.75rem] bg-none px-3 py-4',
    'shadow-[inset_2px_5px_10px_rgba(100,116,139,0.35)]',
    'dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)]',
  ),
);

const concaveBacklinkStyleClasses = twMerge(
  clsx(
    'group relative block w-full cursor-pointer rounded-full',
    'px-5 py-2.5 text-center font-montserrat text-sm font-semibold uppercase tracking-[0.18em]',
    'text-gray-800 outline-none transition duration-200 ease-out dark:text-white',
    'hover:scale-110 hover:text-flipeffect-sky hover:drop-shadow-[0_0_10px_rgba(14,165,233,0.65)]',
    'active:scale-105',
  ),
);

// --- Hover caption explaining where each backlink goes. ---
const backlinkTooltipStyleClasses = twMerge(
  clsx(
    'pointer-events-none absolute right-full top-1/2 z-[60] mr-3 w-52 max-w-[60vw]',
    '-translate-y-1/2 whitespace-normal rounded-xl px-4 py-2.5',
    'font-montserrat text-xs font-medium normal-case leading-snug tracking-normal',
    'opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100',
    'border border-gray-200 bg-white text-gray-700',
    'dark:border-white/15 dark:bg-slate-950/95 dark:text-gray-100',
  ),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->

<template>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
  <Drawer
    v-model:visible="visible"
    position="right"
    :show-close-icon="false"
    :pt="{
      root: { class: 'w-[min(20rem,85vw)] overflow-visible! dark:bg-gray-950' },
      mask: { class: 'backdrop-blur-sm' },
      header: { class: 'border-b border-gray-200 dark:border-gray-800 px-5 py-4' },
      content: { class: 'overflow-visible! px-5 py-0' },
    }"
  >
    <!-- ∞∞∞∞∞∞∞∞ HEADER ∞∞∞∞∞∞∞∞ -->
    <template #header>
      <div class="flex w-full items-center justify-between">
        <NavBrand />
        <Button
          text
          rounded
          icon="pi pi-times"
          aria-label="Close menu"
          class="text-gray-500! dark:text-gray-400! hover:text-gray-900! dark:hover:text-white!"
          @click="visible = false"
        />
      </div>
    </template>

    <!-- ∞∞∞∞∞∞∞∞ DARKMODE TOGGLE ∞∞∞∞∞∞∞∞ -->
    <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 py-4">
      <span class="select-none text-sm font-medium text-gray-600 dark:text-gray-400">Dark mode</span>
      <DarkmodeToggleSwitch />
    </div>

    <!-- ∞∞∞∞∞∞∞∞ APP ROUTES ∞∞∞∞∞∞∞∞ -->
    <nav class="flex flex-col gap-1 py-4">
      <Button
        v-for="link in internalNavLinks"
        :key="link.path"
        text
        :label="link.label"
        :class="appLinkStyleClasses"
        @click="navigateTo(link.path)"
      />
    </nav>

    <!-- ∞∞∞∞∞∞∞∞ THICK DIVIDER: app routes / backlinks ∞∞∞∞∞∞∞∞ -->
    <hr
      v-if="externalNavLinks.length"
      class="mt-3 mb-6 h-px rounded-full border-0 bg-gray-300 dark:bg-gray-700"
    />

    <!-- ∞∞∞∞∞∞∞∞ BACKLINK SITES (one concave container) ∞∞∞∞∞∞∞∞ -->
    <div
      v-if="externalNavLinks.length"
      :class="concaveBacklinkContainerStyleClasses"
    >
      <a
        v-for="link in externalNavLinks"
        :key="link.path"
        :href="link.path"
        :class="concaveBacklinkStyleClasses"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleExternalLinkClick"
      >
        {{ link.label }}
        <span
          v-if="link.description"
          :class="backlinkTooltipStyleClasses"
        >
          {{ link.description }}
        </span>
      </a>
    </div>
  </Drawer>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
