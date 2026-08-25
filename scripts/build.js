import { build } from "vite";

async function run() {
    try {
        console.log("Starting vite build...");
        await build();
        console.log("Vite build finished successfully. Exiting process...");
        process.exit(0);
    } catch (err) {
        console.error("Vite build failed:", err);
        process.exit(1);
    }
}

run();