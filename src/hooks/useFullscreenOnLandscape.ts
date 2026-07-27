import { useEffect } from "react";

function isMobileDevice() {
    return (
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)
    );
}

/**
 * ТИМЧАСОВА ДІАГНОСТИЧНА ВЕРСІЯ.
 * Показує червоний/зелений напис у кутку екрана, щоб перевірити,
 * чи взагалі спрацьовує визначення orientation на конкретному телефоні.
 * Після діагностики — видалити debug-блок і лишити тільки основну логіку.
 */
export function useFullscreenOnLandscape() {
    useEffect(() => {
        const debugBox = document.createElement("div");
        debugBox.style.position = "fixed";
        debugBox.style.top = "0";
        debugBox.style.left = "0";
        debugBox.style.zIndex = "999999";
        debugBox.style.padding = "6px 10px";
        debugBox.style.fontSize = "14px";
        debugBox.style.fontFamily = "monospace";
        debugBox.style.color = "#fff";
        document.body.appendChild(debugBox);

        if (!isMobileDevice()) {
            debugBox.textContent = "isMobileDevice = FALSE (хук не активний)";
            debugBox.style.background = "red";
            return () => debugBox.remove();
        }

        const mq = window.matchMedia("(orientation: landscape)");
        const root = document.documentElement;

        const applyState = (isLandscape: boolean) => {
            root.classList.toggle("force-fullscreen", isLandscape);
            debugBox.textContent = isLandscape
                ? "LANDSCAPE — клас додано"
                : "PORTRAIT — клас знято";
            debugBox.style.background = isLandscape ? "green" : "orange";
        };

        const handler = (e: MediaQueryList | MediaQueryListEvent) =>
            applyState(e.matches);

        handler(mq);
        mq.addEventListener("change", handler);
        return () => {
            mq.removeEventListener("change", handler);
            debugBox.remove();
        };
    }, []);
}