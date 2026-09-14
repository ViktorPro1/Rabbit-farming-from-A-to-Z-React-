// src/components/MetaPixelTracker/MetaPixelTracker.tsx
//
// Нічого не рендерить — лише підписує компонент на зміну маршруту
// і відправляє PageView в Meta Pixel при кожному переході.
// Має рендеритись усередині <BrowserRouter> (App.tsx).

import { useMetaPixelPageView } from "../../hooks/useMetaPixelPageView";

export default function MetaPixelTracker() {
  useMetaPixelPageView();
  return null;
}
