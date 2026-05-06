<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    PAGES: LAYOUTS
    > ROOT_LAYOUT.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                           IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { Footer, LayoutBackgroundImage, NavBar, Show } from '../../components';
import { UseDarkmodeStore } from '../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const store = UseDarkmodeStore();
const { isDarkMode } = storeToRefs(store);
const route = useRoute();

const resolvedBg = computed((): string => {
  return isDarkMode.value ? 'bg-slate-900' : 'bg-white';
});

const layoutBackgroundImage = computed((): string | null => {
  const showLayoutBackground = route.meta.showLayoutBackground === true;
  const layoutBackgroundImage = route.meta.layoutBackgroundImage;

  if (!showLayoutBackground || typeof layoutBackgroundImage !== 'string') {
    return null;
  }

  return layoutBackgroundImage;
});
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->

<template>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
  <div :class="[resolvedBg, 'relative min-h-screen flex flex-col', { 'text-white': isDarkMode }]">
    <Show :when="layoutBackgroundImage">
      <template #default="{ value }">
        <LayoutBackgroundImage :image="value" />
      </template>
    </Show>

	  <!-- ∞∞∞∞∞∞∞∞ NAVBAR-COMPONENT ∞∞∞∞∞∞∞∞ --> 
    <NavBar />
    <main class="relative z-10 flex-1 pt-16">
	    <!-- ∞∞∞∞∞∞∞∞ ROUTER ∞∞∞∞∞∞∞∞ --> 
      <RouterView />
    </main>
	  <!-- ∞∞∞∞∞∞∞∞ FOOTER-COMPONENT ∞∞∞∞∞∞∞∞ -->
    <Footer />
  </div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
