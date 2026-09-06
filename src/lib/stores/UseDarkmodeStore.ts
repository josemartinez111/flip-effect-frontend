// ---------------------------------------------------------
//                  Store > UseDarkmodeStore
// ---------------------------------------------------------
import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';
// ---------------------------------------------------------

export const UseDarkmodeStore = defineStore('darkmodeStore', () => {
  // --- Determine the user's system preference for dark mode ---
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // --- Set initial color scheme based on system preference ---
  const initialColorScheme: 'dark' | 'light' = prefersDarkScheme ? 'dark' : 'light';

  // ---
  // No `onChanged` override here on purpose. VueUse only applies the class
  // through its own default handler, and that handler is what injects the
  // temporary `transition: none` stylesheet around the swap. Overriding
  // `onChanged` skips it, so every transition on the page animates at once
  // and the theme flip reads as a slow fade.
  // ---
  const isDark = useDark({
    selector: 'html',

    // --- Set initial value based on system preference ---
    initialValue: initialColorScheme,
  });

  const toggleDarkMode = useToggle(isDark);

  return { isDarkMode: isDark, toggleDarkMode };
});
// ---------------------------------------------------------
