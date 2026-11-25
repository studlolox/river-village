import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      manifestFilename: 'manifest.webmanifest',
      injectRegister: false,
      manifest: {
        name: 'River Village',
        short_name: 'River Village',
        description: 'Original 2.5D farm-life adventure in River Village',
        start_url: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#1e3528',
        theme_color: '#2d5a3f',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,json,webmanifest}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
      }
    })
  ]
});
