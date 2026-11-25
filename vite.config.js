import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
  },
  server: {
    port: 5173,
    host: true,
  },
});
