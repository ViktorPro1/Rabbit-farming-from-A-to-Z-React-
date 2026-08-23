/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkOnly } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// --- precache (заміна globPatterns з попереднього workbox-конфіга) ---
precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
self.addEventListener('activate', () => self.clients.claim())

// --- runtime caching (перенесено з vite.config.ts один в один) ---
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
    })
)

registerRoute(({ url }) => /^(www\.)?googletagmanager\.com$/.test(url.hostname), new NetworkOnly())
registerRoute(({ url }) => /^(www\.|region\d\.)?google-analytics\.com$/.test(url.hostname), new NetworkOnly())
registerRoute(({ url }) => url.hostname === 'analytics.google.com', new NetworkOnly())

// navigateFallbackDenylist з попереднього конфіга — SPA fallback на index.html,
// але не для sitemap/robots/llms.txt
const denylist = [/^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/llms(-full)?\.txt$/]
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html'), { denylist }))

// --- PUSH-СПОВІЩЕННЯ (нове) ---
self.addEventListener('push', (event: PushEvent) => {
    const data = event.data?.json() ?? {}
    const title = data.title ?? 'Кролівництво від А до Я'
    const options: NotificationOptions = {
        body: data.body ?? '',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: { url: data.url ?? '/' },
    }
    event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close()
    const url = (event.notification.data as { url?: string })?.url ?? '/'
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            const existing = clients.find((c) => c.url === url)
            if (existing) return existing.focus()
            return self.clients.openWindow(url)
        })
    )
})