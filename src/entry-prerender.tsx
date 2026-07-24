import { renderToReadableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import AppRoutes from "./routes/AppRoutes";

async function renderToHtml(app: React.ReactElement): Promise<string> {
  const stream = await renderToReadableStream(app, {
    onError(error) {
      console.error("Prerender render error:", error);
    },
  });

  // чекаємо, поки довантажаться усі lazy-компоненти (аналог onAllReady)
  await stream.allReady;

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let html = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }

  return html;
}

export async function prerender(data: { url: string }) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={data.url}>
        <AppRoutes session={null} />
      </StaticRouter>
    </HelmetProvider>
  );

  const html = await Promise.race([
    renderToHtml(app),
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("Prerender timeout")), 20000),
    ),
  ]);

  const { helmet } = helmetContext;
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
      ].join("")
    : "";

  return { html, head };
}
