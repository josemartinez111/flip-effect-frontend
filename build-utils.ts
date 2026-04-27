// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//               BUILD-UTILS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { Plugin } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { imagetools } from 'vite-imagetools';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// IMAGE CONVERSION (Format & Resize)
// Powered by Sharp. Converts images on import (e.g., import img from './foo.png?format=webp')
// ---
export const ImageTools = imagetools();

// ---
// ASSET OPTIMIZATION
// Standard configuration. No custom SVG overrides to prevent errors.
// Optimizes PNG/JPEG/WebP/SVG automatically.
// ---
export const ImageOptimizer = ViteImageOptimizer({
  logStats: false, // Silenced Logs
  png: { quality: 80 },
  jpeg: { quality: 80 },
  webp: { quality: 80 },
  // By omitting the 'svg' object here, we use the safe defaults.
  // This stops the 'preset-default' console errors.
});

// ---
// STRICT TYPES
// ---
type BundleItem =
  | { type: 'asset'; source: string | Uint8Array } 
  | { type: 'chunk'; code: string };

// ---
// MISSION CONTROL
// Defined as a direct object (Plugin). WebStorm knows closeBundle is part of the API.
// ---
let payloadCache = '';

// noinspection JSUnusedGlobalSymbols
export const MissionReport: Plugin = {
  name: 'mission-report',
  apply: 'build',
  enforce: 'post', // Measures AFTER optimization
  
  generateBundle(_, bundle) {
    let assets = 0;
    let code = 0;
    
    // Strict, safe casting using local types
    const items = Object.values(bundle as unknown as Record<string, BundleItem>);
    
    for (const item of items) {
      if (item.type === 'asset') assets += item.source.length;
      if (item.type === 'chunk') code += item.code.length;
    }
    
    const toMB = (b: number) => (b / 1024 / 1024).toFixed(2);
    
    payloadCache = [
      '\n// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞',
      `// MISSION REPORT: FINAL PAYLOAD`,
      `// JS/CSS Logic:  ${toMB(code)} MB`,
      `// Assets Cargo:  ${toMB(assets)} MB`,
      `// TOTAL WEIGHT:  ${toMB(assets + code)} MB`,
      '// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞\n'
    ].join('\n');
  },
  
  // ---
  // Output Deferral (The Go Logic):
  // Like a 'defer' statement, this waits for the entire build lifecycle
  // to complete (files written, logs flushed) before firing.
  // This guarantees our print is the absolute final entry in the console.
  // ---
  closeBundle() {
    if (payloadCache) console.log(payloadCache);
  }
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
