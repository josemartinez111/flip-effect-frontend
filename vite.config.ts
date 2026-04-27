// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                      vite.config.ts
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { ImageTools, ImageOptimizer, MissionReport } from './build-utils';
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
    // setupFiles: ['./tests/setup.ts'], // ← uncomment when tests exist
  },
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
