import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkg from '../package.json';

/**
 * Sample app that embeds the UIKit straight from `../src` (no build step).
 *
 * - `@amityco/ui-kit-open-source` resolves to `src/index.ts`, so the sample imports the
 *   UIKit exactly like a real integrator would, yet every edit under `src/` hot-reloads
 *   in the browser through Vite HMR / React Fast Refresh.
 * - `.env` is read from the repo root and shares the `STORYBOOK_*` variables with Storybook.
 *
 * Run from the repo root: `pnpm dev`
 */
const repoRoot = path.resolve(__dirname, '..');

export default defineConfig(({ mode }) => ({
  root: __dirname,
  envDir: repoRoot,
  envPrefix: ['VITE_', 'STORYBOOK_'],
  plugins: [react(), tsconfigPaths({ projects: [path.resolve(repoRoot, 'tsconfig.json')] })],
  resolve: {
    alias: {
      '@amityco/ui-kit-open-source': path.resolve(repoRoot, 'src/index.ts'),
    },
  },
  define: {
    // The UIKit source only reads NODE_ENV; keep the rest of process.env out of the bundle.
    'process.env': JSON.stringify({ NODE_ENV: mode }),
    __VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      // Source files live one level above this app's root.
      allow: [repoRoot],
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
}));
