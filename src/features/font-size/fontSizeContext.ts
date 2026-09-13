import { createContext, useContext } from "react";

// Три дискретні рівні замість повзунка — простіше й зрозуміліше
// для авдиторії 50+, яка переважає у статистиці сайту.
export type FontScale = "1" | "2" | "3";

export interface FontSizeContextValue {
    scale: FontScale;
    setScale: (scale: FontScale) => void;
}

export const FontSizeContext = createContext<FontSizeContextValue | undefined>(
    undefined,
);

export function useFontSize(): FontSizeContextValue {
    const ctx = useContext(FontSizeContext);
    if (!ctx) {
        throw new Error("useFontSize має використовуватись всередині FontSizeProvider");
    }
    return ctx;
}