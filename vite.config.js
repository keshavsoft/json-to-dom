import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "docs/dist/v1"),
        emptyOutDir: true,
        minify: true,
        lib: {
            entry: resolve(__dirname, "src/v2/build/buildSpecElement.js"),
            name: "buildSpecElement",
            formats: ["es"],
            fileName: () => "min.js"
        }
    }
});
