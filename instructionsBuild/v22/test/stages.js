import { compile } from "../index.js";
import { buildSpecElement } from "../../../src/v16/index.js";

const statusBadge = document.getElementById("status-badge");
const codeStructure = document.getElementById("code-structure");
const codeData = document.getElementById("code-data");
const codeCompiledSpec = document.getElementById("code-compiled-spec");
const renderTargetId = "rendered-dom-target";

const setStatus = ({ inMessage, inIsError = false } = {}) => {
    const localMessage = inMessage;
    const localIsError = inIsError;

    if (!statusBadge) return;
    statusBadge.textContent = localMessage;
    statusBadge.className = localIsError
        ? "px-3 py-1 text-xs font-mono rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20"
        : "px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
};

const formatJson = ({ inObj } = {}) => {
    const localObj = inObj;
    return JSON.stringify(localObj, null, 2);
};

export const loadAllStages = async () => {
    try {
        setStatus({ inMessage: "Loading structure.json and data.json..." });

        // 1. Fetch structure.json and data.json (2-File Contract)
        const [resStructure, resData] = await Promise.all([
            fetch("../samples/structure.json?t=" + Date.now()),
            fetch("../samples/data.json?t=" + Date.now())
        ]);

        if (!resStructure.ok) throw new Error(`Failed to load structure.json (${resStructure.status})`);
        if (!resData.ok) throw new Error(`Failed to load data.json (${resData.status})`);

        const structure = await resStructure.json();
        const data = await resData.json();

        // 2. Display inputs in panels
        if (codeStructure) codeStructure.textContent = formatJson({ inObj: structure });
        if (codeData) codeData.textContent = formatJson({ inObj: data });

        // 3. Compile: pure 2-file contract (inStructure + inData)
        const startTime = performance.now();
        const compiledSpec = compile({
            inStructure: structure,
            inData: data
        });

        // 4. Display the compiled JSON spec
        if (codeCompiledSpec) codeCompiledSpec.textContent = formatJson({ inObj: compiledSpec });

        // 5. Pass compiled JSON spec to src/v16 DOM engine!
        const container = document.getElementById(renderTargetId);
        if (container) {
            container.innerHTML = "";
            const domElements = buildSpecElement({ inSpec: compiledSpec });
            if (Array.isArray(domElements)) {
                container.append(...domElements);
            } else if (domElements) {
                container.appendChild(domElements);
            }
        }
        const elapsed = (performance.now() - startTime).toFixed(2);

        setStatus({ inMessage: `2-File Contract compiled in ${elapsed}ms -> Rendered via v16 DOM engine` });
    } catch (err) {
        console.error("[Stages Load Error]", err);
        setStatus({ inMessage: `Error: ${err.message}`, inIsError: true });
    }
};

document.getElementById("btn-render-all")?.addEventListener("click", loadAllStages);

// Initial load
loadAllStages();
