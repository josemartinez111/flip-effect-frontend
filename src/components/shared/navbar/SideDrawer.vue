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

const drawerNavLinkStyleClasses = twMerge(
  clsx(
    'w-full cursor-pointer rounded-lg px-3 py-2 text-left',
    'font-orbitron text-sm font-black uppercase tracking-[0.12em]',
    'text-gray-700 transition',
    'hover:bg-gray-100 hover:text-gray-950',
    'dark:text-gray-200 dark:hover:bg-white/8 dark:hover:text-white',
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
      root: { class: 'w-[min(20rem,85vw)] dark:bg-gray-950' },
      mask: { class: 'backdrop-blur-sm' },
      header: { class: 'border-b border-gray-200 dark:border-gray-800 px-5 py-4' },
      content: { class: 'px-5 py-0' },
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

    <!-- ∞∞∞∞∞∞∞∞ NAV LINKS ∞∞∞∞∞∞∞∞ -->
    <nav class="flex flex-col gap-1 py-4">
      <Button
        v-for="link in internalNavLinks"
        :key="link.path"
        text
        :label="link.label"
        class="font-orbitron! w-full! justify-start! text-sm! font-black! tracking-[0.12em]! text-gray-700! uppercase! dark:text-gray-200!"
        @click="navigateTo(link.path)"
      />

      <a
        v-for="link in externalNavLinks"
        :key="link.path"
        :href="link.path"
        :class="drawerNavLinkStyleClasses"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleExternalLinkClick"
      >
        {{ link.label }}
      </a>
    </nav>
  </Drawer>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
