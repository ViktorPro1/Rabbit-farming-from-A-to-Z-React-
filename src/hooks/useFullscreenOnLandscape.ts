import { useEffect } from "react";

function isMobileDevice() {
    return (
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)
    );
}

export function useFullscreenOnLandscape() {
    useEffect(() => {
        if (!isMobileDevice()) return; // на десктопі хук не активується

        const mq = window.matchMedia("(orientation: landscape)");
        const root = document.documentElement;

        const applyState = async (isLandscape: boolean) => {
            root.classList.toggle("force-fullscreen", isLandscape);

            try {
                if (isLandscape && !document.fullscreenElement) {
                    await root.requestFullscreen?.();
                } else if (!isLandscape && document.fullscreenElement) {
                    await document.exitFullscreen?.();
                }
            } catch {
                // iOS Safari не підтримує requestFullscreen на html/div —
                // клас force-fullscreen вже забезпечив CSS-fallback
            }
        };

        const handler = (e: MediaQueryList | MediaQueryListEvent) =>
            applyState(e.matches);

        handler(mq);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
}