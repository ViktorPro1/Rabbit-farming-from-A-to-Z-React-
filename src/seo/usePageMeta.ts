import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMeta } from "./pageMeta";

export function usePageMeta() {
    const { pathname } = useLocation();
    const meta = pageMeta[pathname];

    useEffect(() => {
        if (!meta) return;

        // Title
        document.title = meta.title;

        // Description
        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute("content", meta.description);

        // Schema
        const existing = document.getElementById("page-schema");
        if (existing) existing.remove();

        if (meta.schema) {
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