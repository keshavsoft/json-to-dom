import { renderSpecToDom, compileTemplate } from "../index.js?t=17002";

const statusBadge = document.getElementById("status-badge");
const codeStructure = document.getElementById("code-structure");
const codeInstructions = document.getElementById("code-instructions");
const codeData = document.getElementById("code-data");
const codeTemplate = document.getElementById("code-template");
const codeSpec = document.getElementById("code-spec");
const renderTargetId = "rendered-dom-target";

const setStatus = ({ inMessage, inIsError = false }) => {
    const localMessage = inMessage;
    const localIsError = inIsError;

    if (!statusBadge) return;
    statusBadge.textContent = localMessage;
    statusBadge.className = localIsError
        ? "px-3 py-1 text-xs font-mono rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20"
        : "px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
};

const formatJson = ({ inObj }) => {
    const localObj = inObj;
    return JSON.stringify(localObj, null, 2);
};

export const loadAllStages = async () => {
    try {
        setStatus({ inMessage: "Loading spec.json..." });

        // 1. Load That Last JSON (spec.json) directly
        const resSpec = await fetch("../samples/spec.json?t=" + Date.now());
        if (!resSpec.ok) {
            throw new Error(`Failed to load spec.json (${resSpec.status})`);
        }
        const spec = await resSpec.json();

        // 2. Display spec.json in the code panel
        if (codeSpec) codeSpec.textContent = formatJson({ inObj: spec });

        // 3. Render spec.json directly to DOM via v14 engine!
        const startTime = performance.now();
        renderSpecToDom({
            inSpec: spec,
            inDomIdToPushTo: renderTargetId
        });
        const elapsed = (performance.now() - startTime).toFixed(2);

        setStatus({ inMessage: `Rendered from spec.json via v14 in ${elapsed}ms` });

        // Optionally populate other sample blocks if they exist (gracefully without crashing)
        fetch("../samples/structure.json?t=" + Date.now())
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data && codeStructure) codeStructure.textContent = formatJson({ inObj: data }); })
            .catch(() => {});

        fetch("../samples/instructions.json?t=" + Date.now())
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data && codeInstructions) codeInstructions.textContent = formatJson({ inObj: data }); })
            .catch(() => {});

        fetch("../samples/template.json?t=" + Date.now())
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data && codeTemplate) codeTemplate.textContent = formatJson({ inObj: data }); })
            .catch(() => {});

    } catch (err) {
        console.error("[Stages Load Error]", err);
        setStatus({ inMessage: `Error loading spec.json: ${err.message}`, inIsError: true });
    }
};

document.getElementById("btn-render-all")?.addEventListener("click", loadAllStages);

// Initial load
loadAllStages();
