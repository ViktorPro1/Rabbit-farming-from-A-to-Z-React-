import { pageMeta, BASE_URL } from "./pageMeta";

const SITE_NAME = "Кролівництво від А до Я";
const COMMUNITY_URL = "https://t.me/rabbit_farming_from_a_to_z";

// Формат, який очікує vite-prerender-plugin у полі `head` результату prerender().
export interface HeadElement {
    type: string;
    props: Record<string, string>;
    children?: string;
}

export interface PrerenderHead {
    lang: string;
    title: string;
    elements: Set<HeadElement>;
}

/** "/faq/" -> "/faq", "/faq?x=1" -> "/faq", "" -> "/" */
export function normalizePath(url: string): string {
    const pathname = url.split(/[?#]/)[0] || "/";
    const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : "/";
}

/**
 * Збирає теги <head> для сторінки під час пререндеру.
 * Логіка та сама, що в usePageMeta, але без useEffect, який на сервері не виконується.
 */
export function buildPrerenderHead(url: string): {
    head: PrerenderHead;
    hasOwnMeta: boolean;
} {
    const path = normalizePath(url);
    const own = pageMeta[path];
    const meta = own ?? pageMeta["/"];
    const canonical = path === "/" ? `${BASE_URL}/` : `${BASE_URL}${path}`;

    const elements = new Set<HeadElement>([
        { type: "meta", props: { name: "description", content: meta.description } },
        { type: "link", props: { rel: "canonical", href: canonical } },
        { type: "meta", props: { property: "og:url", content: canonical } },
        { type: "meta", props: { property: "og:title", content: meta.title } },
        { type: "meta", props: { property: "og:description", content: meta.description } },
        { type: "meta", props: { name: "twitter:title", content: meta.title } },
        { type: "meta", props: { name: "twitter:description", content: meta.description } },
    ]);

    // Якщо в сторінки є власна схема, беремо її.
    // Якщо власні мета-дані є, а схеми немає, будуємо стандартну схему Article.
    // Якщо власних мета-даних немає зовсім, схему не додаємо: інакше сторінка
    // отримала б назву й опис головної.
    const pageSchema =
        own?.schema ??
        (own
            ? {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: meta.title,
                description: meta.description,
                url: canonical,
                inLanguage: "uk-UA",
                author: {
                    "@type": "Organization",
                    name: SITE_NAME,
                    url: BASE_URL,
                    sameAs: [COMMUNITY_URL],
                },
                publisher: {
                    "@type": "Organization",
                    name: SITE_NAME,
                    url: BASE_URL,
                    logo: {
                        "@type": "ImageObject",
                        url: `${BASE_URL}/breed.svg`,
                    },
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": canonical,
                },
            }
            : undefined);

    if (pageSchema) {
        elements.add({
            type: "script",
            props: { type: "application/ld+json", id: "page-schema" },
            // "<" екрануємо, щоб текст усередині JSON не міг закрити тег <script>
            children: JSON.stringify(pageSchema).replace(/</g, "\\u003c"),
        });
    }

    return {
        head: { lang: "uk", title: meta.title, elements },
        hasOwnMeta: Boolean(own),
    };
}