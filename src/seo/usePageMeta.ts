import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMeta, BASE_URL } from "./pageMeta";

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
    const meta = pageMeta[pathname];

    useEffect(() => {
        // Кожна сторінка має власний canonical (а не завжди головну),
        // інакше Google вважає всі сторінки дублікатами "/" і не індексує їх.
        const canonical =
            pathname === "/" ? `${BASE_URL}/` : `${BASE_URL}${pathname}`;
        setCanonical(canonical);
        setMetaByProperty("og:url", canonical);

        if (meta) {
            document.title = meta.title;
            setMetaByName("description", meta.description);
            setMetaByProperty("og:title", meta.title);
            setMetaByProperty("og:description", meta.description);
            setMetaByName("twitter:title", meta.title);
            setMetaByName("twitter:description", meta.description);
        }

        const existing = document.getElementById("page-schema");
        if (existing) existing.remove();

        if (meta?.schema) {
            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.id = "page-schema";
            script.textContent = JSON.stringify(meta.schema);
            document.head.appendChild(script);
        }

        return () => {
            const el = document.getElementById("page-schema");
            if (el) el.remove();
        };
    }, [pathname, meta]);
}
