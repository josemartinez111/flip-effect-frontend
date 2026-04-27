// ---------------------------------------------------------
//              stores/UseScrollAnimationStore.ts
// ---------------------------------------------------------

import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// ---------------------------------------------------------

type AnimationOptions = {
  threshold?: number; // IntersectionObserver trigger point (0.0–1.0)
  rootMargin?: string; // Viewport margin (e.g., '0px 0px -50px 0px')
};

// ---------------------------------------------------------

export const UseScrollAnimationStore = defineStore('scrollAnimationStore', () => {
  const sectionVisibility = ref<Record<string, boolean>>({});
  const animationOptions = ref<AnimationOptions>({});
  let observer: IntersectionObserver | null = null;

  const configure = (options: AnimationOptions): void => {
    animationOptions.value = options;
  };

  const setVisible = (sectionId: string, visible: boolean): void => {
    sectionVisibility.value[sectionId] = visible;
  };

  const computeAnimateSection = (sectionId: string): string => {
    const isVisible = sectionVisibility.value[sectionId] ?? false;

    return twMerge(
      clsx(
        'transition-all duration-500 ease-out transform-gpu',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
      ),
    );
  };

  onMounted(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        if (sectionId) {
          setVisible(sectionId, entry.isIntersecting);
        }
      });
    };

    observer = new IntersectionObserver(handleIntersection, {
      threshold: animationOptions.value.threshold ?? 0.5,
      rootMargin: animationOptions.value.rootMargin ?? '0px',
    });

    document.querySelectorAll<HTMLElement>('[data-animate-section]').forEach((section) => {
      const sectionId = section.id;
      if (sectionId) {
        sectionVisibility.value[sectionId] = false;
        observer!.observe(section);
      }
    });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { sectionVisibility, configure, computeAnimateSection };
});

// ---------------------------------------------------------
