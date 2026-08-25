import { build } from "vite";

async function run() {
    try {
        console.log("Starting vite build...");
        console.log("DEBUG: process.env.NODE_ENV =", process.env.NODE_ENV);
        console.log("DEBUG: VITE_SENTRY_DSN present in process.env?", Boolean(process.env.VITE_SENTRY_DSN));
        console.log("DEBUG: VITE_SENTRY_DSN length =", (process.env.VITE_SENTRY_DSN || "").length);

        const result = await build();

        console.log("DEBUG: resolved config mode =", result?.config?.mode);
        console.log("Vite build finished successfully. Exiting process...");
        process.exit(0);
    } catch (err) {
        console.error("Vite build failed:", err);
        process.exit(1);
    }
}

run();