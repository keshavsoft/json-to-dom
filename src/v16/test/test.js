import { resolveSpec, renderToDom, renderSpecToDom, domToSpec } from "../index.js?t=12345";
import {
    sampleStructure,
    sampleInstructions,
    sampleData
} from "../samples/defaultSamples.js";

const structureTextarea = document.getElementById("structure-input");
const instructionsTextarea = document.getElementById("instructions-input");
const dataTextarea = document.getElementById("data-input");
const specOutput = document.getElementById("spec-output");
const reverseOutput = document.getElementById("reverse-output");
const statusBadge = document.getElementById("status-badge");
const renderTargetId = "rendered-dom-target";

const v14JsonOutput = document.getElementById("v14-json-output");
const v14HtmlOutput = document.getElementById("v14-html-output");
const tabV14Json = document.getElementById("tab-v14-json");
const tabV14Visual = document.getElementById("tab-v14-visual");
const tabV14Html = document.getElementById("tab-v14-html");
const v14JsonPanel = document.getElementById("v14-json-panel");
const v14VisualPanel = document.getElementById("v14-visual-panel");
const v14HtmlPanel = document.getElementById("v14-html-panel");

const formatJson = ({ inObj }) => {
    const localObj = inObj;
    return JSON.stringify(localObj, null, 2);
};

const setStatus = ({ inMessage, inIsError = false }) => {
    const localMessage = inMessage;
    const localIsError = inIsError;

    if (!statusBadge) return;
    statusBadge.textContent = localMessage;
    statusBadge.className = localIsError
        ? "px-3 py-1 text-xs font-mono rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20"
        : "px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
};

const switchTab = ({ inActiveTab }) => {
    const localActiveTab = inActiveTab;

    const tabs = [
        { id: "json", btn: tabV14Json, panel: v14JsonPanel },
        { id: "visual", btn: tabV14Visual, panel: v14VisualPanel },
        { id: "html", btn: tabV14Html, panel: v14HtmlPanel }
    ];

    tabs.forEach(({ id, btn, panel }) => {
        if (id === localActiveTab) {
            panel?.classList.remove("hidden");
            btn?.classList.remove("text-slate-400");
            btn?.classList.add("bg-indigo-600", "text-white");
        } else {
            panel?.classList.add("hidden");
            btn?.classList.remove("bg-indigo-600", "text-white");
            btn?.classList.add("text-slate-400");
        }
    });
};

tabV14Json?.addEventListener("click", () => switchTab({ inActiveTab: "json" }));
tabV14Visual?.addEventListener("click", () => switchTab({ inActiveTab: "visual" }));
tabV14Html?.addEventListener("click", () => switchTab({ inActiveTab: "html" }));

export const resetInputs = () => {
    if (structureTextarea) structureTextarea.value = formatJson({ inObj: sampleStructure });
    if (instructionsTextarea) instructionsTextarea.value = formatJson({ inObj: sampleInstructions });
    if (dataTextarea) dataTextarea.value = formatJson({ inObj: sampleData });
    executeEngine();
};

/**
 * Step 2 ONLY: Takes That Last JSON (spec) and renders it directly to the HTML DOM.
 */
export const executeRenderSpecOnly = () => {
    try {
        const startTime = performance.now();
        const spec = JSON.parse(specOutput.value);

        // Render using ONLY That Last JSON
        renderSpecToDom({
            inSpec: spec,
            inDomIdToPushTo: renderTargetId
        });

        const elapsed = (performance.now() - startTime).toFixed(2);

        // Reverse extract DOM back into v14 output JSON
        const targetContainer = document.getElementById(renderTargetId);
        if (targetContainer?.firstElementChild) {
            const reversedSpec = domToSpec({ inNode: targetContainer.firstElementChild });
            const formattedReversed = formatJson({ inObj: reversedSpec });
            if (v14JsonOutput) v14JsonOutput.textContent = formattedReversed;
            if (reverseOutput) reverseOutput.textContent = formattedReversed;
        }

        if (v14HtmlOutput && targetContainer) {
            v14HtmlOutput.textContent = targetContainer.innerHTML.trim();
        }

        setStatus({ inMessage: `Rendered from That Last JSON in ${elapsed}ms` });
    } catch (err) {
        console.error("[Render Spec Only Error]", err);
        setStatus({ inMessage: `Spec Error: ${err.message}`, inIsError: true });
    }
};

/**
 * Full Pipeline: Step 1 (Resolve 3 JSONs -> Spec) + Step 2 (Render Spec -> DOM)
 */
export const executeEngine = () => {
    try {
        const startTime = performance.now();

        const structure = JSON.parse(structureTextarea.value);
        const instructions = JSON.parse(instructionsTextarea.value);
        const data = JSON.parse(dataTextarea.value);

        // Step 1: Resolve the 3 JSONs into That Last JSON (the spec)
        const resolvedSpec = resolveSpec({
            inStructure: structure,
            inInstructions: instructions,
            inData: data
        });

        // Populate That Last JSON in the editor
        if (specOutput) {
            specOutput.value = formatJson({ inObj: resolvedSpec });
        }

        // Step 2: Render to HTML DOM using ONLY That Last JSON!
        executeRenderSpecOnly();

        const elapsed = (performance.now() - startTime).toFixed(2);
        setStatus({ inMessage: `Full pipeline completed in ${elapsed}ms` });
    } catch (err) {
        console.error("[v15 Playground Error]", err);
        setStatus({ inMessage: `Error: ${err.message}`, inIsError: true });
    }
};

document.getElementById("btn-render")?.addEventListener("click", executeEngine);
document.getElementById("btn-reset")?.addEventListener("click", resetInputs);
document.getElementById("btn-render-spec-only")?.addEventListener("click", executeRenderSpecOnly);

// Auto-render on input changes with debounce
let debounceTimer;
const onInputChange = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(executeEngine, 400);
};

const onSpecInputChange = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(executeRenderSpecOnly, 400);
};

structureTextarea?.addEventListener("input", onInputChange);
instructionsTextarea?.addEventListener("input", onInputChange);
dataTextarea?.addEventListener("input", onInputChange);
specOutput?.addEventListener("input", onSpecInputChange);

// Initial execution
resetInputs();

