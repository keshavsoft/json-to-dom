import { buildSpecElement, data } from "../index.js";

const specViewer = document.getElementById("spec-viewer");
const renderTarget = document.getElementById("render-target");
const statusBadge = document.getElementById("status-badge");

export const runHybridTest = () => {
    try {
        const hybridRowSpec = data.hybrid?.inlineInputRow;

        if (!hybridRowSpec) {
            throw new Error("data.hybrid.inlineInputRow not found!");
        }

        // Display the raw hybrid spec JSON
        if (specViewer) {
            specViewer.textContent = JSON.stringify(hybridRowSpec, null, 2);
        }

        // Build the live DOM element with v16
        const startTime = performance.now();
        const domElement = buildSpecElement({ inSpec: hybridRowSpec });
        const elapsed = (performance.now() - startTime).toFixed(2);

        // Mount into container
        if (renderTarget && domElement) {
            renderTarget.innerHTML = "";
            renderTarget.appendChild(domElement);
        }

        if (statusBadge) {
            statusBadge.textContent = `Rendered via v16 in ${elapsed}ms`;
        }
    } catch (err) {
        console.error("[v16 Hybrid Test Error]", err);
        if (statusBadge) {
            statusBadge.textContent = `Error: ${err.message}`;
            statusBadge.className = "px-3 py-1 text-xs font-mono rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20";
        }
    }
};

runHybridTest();
