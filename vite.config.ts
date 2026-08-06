import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { prerenderRoutes } from "./src/prerender-routes";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),

    visualizer({
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),

    vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: "./src/entry-prerender.tsx",
      additionalPrerenderRoutes: prerenderRoutes,
    }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        id: '/',
        name: 'Кролівництво від А до Я',
        short_name: 'Кролівництво',
        description: 'Повний довідник з кролівництва — породи, догляд, годування, хвороби',
        theme_color: '#27500A',
        background_color: '#faf7f0',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'uk-UA',
        categories: ['utilities', 'books', 'education'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
        ],
        shortcuts: [
          {
            name: 'Маршрут новачка',
            short_name: 'Новачок',
            description: 'Купив першого кроля — починай тут',
            url: '/beginner-guide',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Типові помилки новачків',
            short_name: 'Помилки',
            description: '26 помилок що вбивають кролів — і як їх уникнути',
            url: '/beginner-mistakes',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Породи кролів',
            short_name: 'Породи',
            description: 'Огляд популярних порід',
            url: '/breeds',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Словник кролівника',
            short_name: 'Словник',
            description: 'Терміни та професійні поняття простими словами',
            url: '/glossary',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: 'screenshots/desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Головна сторінка довідника на десктопі'
          },
          {
            src: 'screenshots/mobile.png',
            sizes: '412x915',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Головна сторінка довідника на мобільному'
          }
        ]
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/test/**',
        'src/**/*.d.ts',
        'src/routes/groups/**',
        'scripts/**',
        '**/*.config.*',
        '**/*.css',
      ],
    },
  },
})