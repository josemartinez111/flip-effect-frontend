<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!--        components/shared/navbar/NavBrand.vue                      -->
<!-- ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->

<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { FantumWaveLogo } from '../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const sharedTextClassStyles = twMerge(clsx(
  'bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500',
  'bg-clip-text text-transparent',
  'py-4 text-sm font-extrabold font-orbitron whitespace-nowrap',
  'tablet:text-base laptop:text-xl',
));

const glowClass = twMerge(clsx(
  sharedTextClassStyles,
  'absolute mx-auto w-fit select-none blur-xl',
));

const textClass = twMerge(clsx(
  sharedTextClassStyles,
  'relative h-auto w-fit select-auto',
));
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>

<template>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
  <RouterLink to="/" class="flex items-center gap-4 tablet:gap-6">

    <!-- --- Placeholder logo --- -->
    <img
      :src="FantumWaveLogo"
      alt="FantumWave Logo"
      class="ml-2 max-w-10 rounded-full object-contain tablet:max-w-14"
    />

    <!-- --- Gradient Orbitron text with glow behind --- -->
    <div class="relative flex">
      <span :class="glowClass" aria-hidden="true">FantumWave</span>
      <h1 :class="textClass">FantumWave</h1>
    </div>

  </RouterLink>
  <!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
</template>
