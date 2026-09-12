import {
    buildSpecElement,
    renderSpecToDom,
    domToSpec
} from "../index.js?t=16001";

const specTextarea = document.getElementById("spec-input");
const statusBadge = document.getElementById("status-badge");
const specStats = document.getElementById("spec-stats");
const domStats = document.getElementById("dom-stats");
const renderTargetId = "rendered-dom-target";

const tabVisual = document.getElementById("tab-visual");
const tabHtml = document.getElementById("tab-html");
const tabReverse = document.getElementById("tab-reverse");

const panelVisual = document.getElementById("panel-visual");
const panelHtml = document.getElementById("panel-html");
const panelReverse = document.getElementById("panel-reverse");

const htmlOutput = document.getElementById("html-output");
const reverseOutput = document.getElementById("reverse-output");

let originalSpecRaw = "";

const setStatus = ({ inMessage, inIsError = false }) => {
    const localMessage = inMessage;
    const localIsError = inIsError;

    if (!statusBadge) return;
    statusBadge.textContent = localMessage;
    statusBadge.className = localIsError
        ? "px-3 py-1 text-xs font-mono rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20"
        : "px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
};

const switchTab = ({ inActiveTab }) => {
    const localActiveTab = inActiveTab;

    const tabs = [
        { id: "visual", btn: tabVisual, panel: panelVisual },
        { id: "html", btn: tabHtml, panel: panelHtml },
        { id: "reverse", btn: tabReverse, panel: panelReverse }
    ];

    tabs.forEach(({ id, btn, panel }) => {
        if (id === localActiveTab) {
            panel?.classList.remove("hidden");
            btn?.classList.remove("text-slate-400");
            btn?.classList.add("bg-emerald-600", "text-white");
        } else {
            panel?.classList.add("hidden");
            btn?.classList.remove("bg-emerald-600", "text-white");
            btn?.classList.add("text-slate-400");
        }
    });
};

tabVisual?.addEventListener("click", () => switchTab({ inActiveTab: "visual" }));
tabHtml?.addEventListener("click", () => switchTab({ inActiveTab: "html" }));
tabReverse?.addEventListener("click", () => switchTab({ inActiveTab: "reverse" }));

/**
 * Renders spec.json directly to DOM and updates inspection panels.
 */
export const executeRender = () => {
    try {
        const startTime = performance.now();
        const rawText = specTextarea?.value || "";
        const spec = JSON.parse(rawText);

        // Update lines stat
        const lineCount = rawText.split("\n").length;
        if (specStats) {
            specStats.textContent = `${lineCount} lines • ${rawText.length} bytes`;
        }

        // Render directly to DOM container
        renderSpecToDom({
            inSpec: spec,
            inDomIdToPushTo: renderTargetId
        });

        const elapsed = (performance.now() - startTime).toFixed(2);
        const container = document.getElementById(renderTargetId);

        if (container && container.firstElementChild) {
            // Update Outer HTML tab
            if (htmlOutput) {
                htmlOutput.textContent = container.innerHTML.trim();
            }

            // Update Reverse domToSpec tab
            if (reverseOutput) {
                const reversed = domToSpec({ inNode: container.firstElementChild });
                reverseOutput.textContent = JSON.stringify(reversed, null, 2);
            }

            // Count rendered DOM nodes
            const renderedElementsCount = container.getElementsByTagName("*").length;
            if (domStats) {
                domStats.textContent = `Rendered ${renderedElementsCount} DOM nodes in ${elapsed}ms`;
            }
        }

        setStatus({ inMessage: `Rendered in ${elapsed}ms` });
    } catch (err) {
        console.error("[v16 spec.json Render Error]", err);
        setStatus({ inMessage: `Error: ${err.message}`, inIsError: true });
    }
};

/**
 * Loads spec.json from disk and renders immediately.
 */
export const loadAndRenderSpec = async () => {
    try {
        setStatus({ inMessage: "Loading spec.json..." });
        const res = await fetch("../samples/spec.json?t=" + Date.now());
        if (!res.ok) {
            throw new Error(`Failed to load spec.json (${res.status})`);
        }
        const spec = await res.json();
        originalSpecRaw = JSON.stringify(spec, null, 2);

        if (specTextarea) {
            specTextarea.value = originalSpecRaw;
        }

        executeRender();
    } catch (err) {
        console.error("[Load spec.json Error]", err);
        setStatus({ inMessage: `Failed to load spec.json: ${err.message}`, inIsError: true });
    }
};

export const resetToOriginalSpec = () => {
    if (specTextarea && originalSpecRaw) {
        specTextarea.value = originalSpecRaw;
        executeRender();
    } else {
        loadAndRenderSpec();
    }
};

document.getElementById("btn-render")?.addEventListener("click", executeRender);
document.getElementById("btn-reset")?.addEventListener("click", resetToOriginalSpec);

let debounceTimer;
specTextarea?.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(executeRender, 250);
});

// Boot up
loadAndRenderSpec();
