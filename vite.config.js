import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		sourcemap: true,
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'src/resources/js/marketin-bridge.js'),
			name: 'MarketinBridge',
			fileName: () => 'marketin-bridge.js',
			formats: ['iife'],
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
});
