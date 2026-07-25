import { useEffect } from 'react';

/**
 * useTVNavigation
 *
 * Вмикає навігацію по сайту стрілками пульта (джойстиком Smart TV):
 * - ArrowUp / ArrowDown / ArrowLeft / ArrowRight переміщують фокус
 *   між усіма інтерактивними елементами (посилання, кнопки, картки з tabindex)
 *   за їх реальним розташуванням на екрані.
 * - Enter / OK активує елемент (це вже вміє сам браузер для <a>/<button>,
 *   якщо на них стоїть фокус).
 * - Фокус-рамка показується лише після того, як користувач почав
 *   користуватись пультом/клавіатурою (клас "tv-nav-active" на <body>),
 *   і зникає, якщо користувач клікнув мишкою/тапнув по екрану.
 *
 * Підключити один раз у кореневому компоненті (наприклад App.tsx):
 *   useTVNavigation();
 */

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([aria-disabled="true"])',
].join(',');

function isVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return false;
    return true;
}

function getFocusableElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);
}

function isTextEditable(el: Element | null): boolean {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === 'TEXTAREA') return true;
    if (tag === 'INPUT') {
        const type = (el as HTMLInputElement).type;
        return !['button', 'submit', 'checkbox', 'radio', 'range', 'file'].includes(type);
    }
    return (el as HTMLElement).isContentEditable === true;
}

type Direction = 'up' | 'down' | 'left' | 'right';

interface NearestResult {
    element: HTMLElement;
    primary: number;
}

function findNearest(current: HTMLElement, candidates: HTMLElement[], direction: Direction): NearestResult | null {
    const a = current.getBoundingClientRect();
    const ax = a.left + a.width / 2;
    const ay = a.top + a.height / 2;

    let best: HTMLElement | null = null;
    let bestPrimary = Infinity;
    let bestScore = Infinity;

    for (const el of candidates) {
        if (el === current) continue;
        const b = el.getBoundingClientRect();
        const bx = b.left + b.width / 2;
        const by = b.top + b.height / 2;

        const dx = bx - ax;
        const dy = by - ay;

        let primary: number;
        let secondary: number;

        switch (direction) {
            case 'right':
                if (dx <= 0) continue;
                primary = dx;
                secondary = dy;
                break;
            case 'left':
                if (dx >= 0) continue;
                primary = -dx;
                secondary = dy;
                break;
            case 'down':
                if (dy <= 0) continue;
                primary = dy;
                secondary = dx;
                break;
            case 'up':
                if (dy >= 0) continue;
                primary = -dy;
                secondary = dx;
                break;
        }

        // Пріоритет елементам майже по прямій лінії руху,
        // з невеликим штрафом за відхилення в перпендикулярному напрямку.
        const score = primary + Math.abs(secondary) * 2;

        if (score < bestScore) {
            bestScore = score;
            bestPrimary = primary;
            best = el;
        }
    }

    if (!best) return null;
    return { element: best, primary: bestPrimary };
}

// Якщо найближчий фокусований елемент далі, ніж приблизно один екран,
// вважаємо що "поруч" нічого немає — краще дати звичайний скрол сторінки,
// ніж перестрибувати фокус у хедер/футер через увесь текст статті.
function isWithinReach(primary: number, direction: Direction): boolean {
    const limit = direction === 'left' || direction === 'right'
        ? window.innerWidth * 1.2
        : window.innerHeight * 1.1;
    return primary <= limit;
}

export function useTVNavigation(): void {
    useEffect(() => {
        const activateTvMode = () => document.body.classList.add('tv-nav-active');
        const deactivateTvMode = () => document.body.classList.remove('tv-nav-active');

        const handleKeyDown = (e: KeyboardEvent) => {
            const directions: Record<string, Direction> = {
                ArrowUp: 'up',
                ArrowDown: 'down',
                ArrowLeft: 'left',
                ArrowRight: 'right',
            };

            const direction = directions[e.key];
            if (!direction) return;

            const active = document.activeElement as HTMLElement | null;

            // Не перехоплюємо стрілки, якщо фокус у полі вводу тексту —
            // там стрілки мають рухати курсор, а не фокус.
            if (isTextEditable(active)) return;

            activateTvMode();

            const candidates = getFocusableElements();
            const current = active && candidates.includes(active) ? active : candidates[0];

            if (!current) return;

            if (!active || active === document.body) {
                current.focus();
                e.preventDefault();
                return;
            }

            const next = findNearest(current, candidates, direction);
            if (next && isWithinReach(next.primary, direction)) {
                next.element.focus();
                next.element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                e.preventDefault();
            }
            // якщо найближчий елемент задалеко (наприклад хедер/футер під час
            // читання довгої статті) — стрілку не перехоплюємо, браузер сам
            // проскролить сторінку природним чином
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', deactivateTvMode);
        window.addEventListener('touchstart', deactivateTvMode);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', deactivateTvMode);
            window.removeEventListener('touchstart', deactivateTvMode);
        };
    }, []);
}