// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                      vite.config.ts
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { ImageTools, ImageOptimizer, MissionReport } from './build-utils.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    ImageTools,
    ImageOptimizer,
    MissionReport,
    visualizer({ open: false, gzipSize: true, brotliSize: true }),
  ],

  optimizeDeps: {
    include: [
      '@primeuix/themes/aura',
      'primevue/button',
      'primevue/card',
      'primevue/carousel',
      'primevue/checkbox',
      'primevue/config',
      'primevue/dialog',
      'primevue/divider',
      'primevue/drawer',
      'primevue/inputtext',
      'primevue/progressbar',
      'primevue/select',
      'primevue/tag',
      'primevue/timeline',
      'primevue/toast',
      'primevue/toastservice',
      'primevue/usetoast',
    ],
  },

  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const chunkMap = [
              { libs: ['primevue', '@primevue'],   chunk: 'prime-ui'    },
              { libs: ['jspdf'],                   chunk: 'pdf-utils'   },
              { libs: ['docx'],                    chunk: 'docx-utils'  },
              { libs: ['vue', '@vueuse'],          chunk: 'vue-vendor'  },
            ];
            for (const { libs, chunk } of chunkMap) {
              if (libs.some((lib) => id.includes(lib))) return chunk;
            }
          }
        },
      },
    },
  },

  test: {
    environment: 'jsdom',
    // --- Worker tests own a separate workerd config; this command verifies only the Vue application. ---
    include: ['src/**/*.test.ts'],
    // setupFiles: ['./tests/setup.ts'], // ← uncomment when tests exist
  },
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
