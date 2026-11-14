import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    pageMeta,
    BASE_URL,
    SITE_NAME,
    DEFAULT_OG_IMAGE,
} from "./pageMeta";

const COMMUNITY_URL = "https://t.me/rabbit_farming_from_a_to_z";

function setMetaByName(name: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
    );
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setCanonical(href: string) {
    let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

export function usePageMeta() {
    const { pathname } = useLocation();
    const own = pageMeta[pathname];
    const meta = own ?? pageMeta["/"];

    useEffect(() => {
        // Кожна сторінка має власний canonical (а не завжди головну),
        // інакше Google вважає всі сторінки дублікатами "/" і не індексує їх.
        const canonical =
            pathname === "/" ? `${BASE_URL}/` : `${BASE_URL}${pathname}`;
        setCanonical(canonical);
        setMetaByProperty("og:url", canonical);
        setMetaByProperty("og:type", "website");
        setMetaByProperty("og:site_name", SITE_NAME);
        setMetaByProperty("og:locale", "uk_UA");
        setMetaByProperty("og:image", DEFAULT_OG_IMAGE);
        setMetaByProperty("og:image:alt", SITE_NAME);

        if (meta) {
            document.title = meta.title;
            setMetaByName("description", meta.description);
            setMetaByName("robots", "index,follow");
            setMetaByProperty("og:title", meta.title);
            setMetaByProperty("og:description", meta.description);
            setMetaByName("twitter:title", meta.title);
            setMetaByName("twitter:description", meta.description);
            setMetaByName("twitter:card", "summary_large_image");
            setMetaByName("twitter:image", DEFAULT_OG_IMAGE);
        }

        const existing = document.getElementById("page-schema");
        if (existing) existing.remove();

        // Якщо в сторінки є власна схема, беремо її.
        // Якщо власні мета-дані є, а схеми немає, будуємо стандартну схему Article.
        // Якщо власних мета-даних немає зовсім, схему не додаємо:
        // інакше сторінка отримала б назву й опис головної.
        const pageSchema =
            own?.schema ??
            (own
                ? {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: own.title,
                    description: own.description,
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
            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.id = "page-schema";
            script.textContent = JSON.stringify(pageSchema);
            document.head.appendChild(script);
        }

        return () => {
            const el = document.getElementById("page-schema");
            if (el) el.remove();
        };
    }, [pathname, own, meta]);
}