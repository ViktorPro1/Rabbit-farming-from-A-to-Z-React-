import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { prerenderRoutes } from "./src/prerender-routes";

export default defineConfig({
  plugins: [
    react(),

    vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: "./src/entry-prerender.tsx",
      additionalPrerenderRoutes: prerenderRoutes,
    }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Кролівництво від А до Я',
        short_name: 'Кролівництво',
        description: 'Повний довідник з кролівництва — породи, догляд, годування, хвороби',
        theme_color: '#27500A',
        background_color: '#faf7f0',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2}'],
        globIgnores: ['**/og-image.webp'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/(www\.)?googletagmanager\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/(www\.|region\d\.)?google-analytics\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/analytics\.google\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),

  ],
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      external: ['fsevents'],
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
        },
      },
    },
  },
})