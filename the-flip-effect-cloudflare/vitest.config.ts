// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: VITEST.CONFIG.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { fileURLToPath, URL } from 'node:url';
import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Vite (vitest) ignores tsconfig `paths`, so the worker's aliases are re-declared here or the bundled worker can't resolve its own imports under test. ---
const aliasDir = (relative: string): string =>
	fileURLToPath(new URL(relative, import.meta.url));

// --- cloudflareTest plugin runs tests inside real workerd, loading the same wrangler.toml bindings (KV, vars) the worker ships with. ---
const config = defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: './wrangler.toml' },
		}),
	],
	resolve: {
		alias: {
			'@app/': aliasDir('./app/'),
			'@congressional-balance-module/': aliasDir(
				'./app/api-modules/congressional-balance-module/',
			),
			'@representatives-module/': aliasDir(
				'./app/api-modules/representatives-module/',
			),
			'@approval-module/': aliasDir('./app/api-modules/approval-module/'),
			'@health-check-module/': aliasDir(
				'./app/api-modules/health-check-module/',
			),
			'@shared-module/': aliasDir('./app/api-modules/shared-module/'),
		},
	},
});
// noinspection JSUnusedGlobalSymbols
export default config;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
