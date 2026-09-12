import { renderSpecToDom, compileStructure } from "../index.js?t=18002";

const statusBadge = document.getElementById("status-badge");
const codeStructure = document.getElementById("code-structure");
const codeInstructions = document.getElementById("code-instructions");
const codeData = document.getElementById("code-data");
const codeCompiledSpec = document.getElementById("code-compiled-spec");
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
        setStatus({ inMessage: "Loading 3 JSON files..." });

        // 1. Fetch only the 3 JSON files from samples/
        const [resStructure, resInstructions, resData] = await Promise.all([
            fetch("../samples/structure.json?t=" + Date.now()),
            fetch("../samples/instructions.json?t=" + Date.now()),
            fetch("../samples/data.json?t=" + Date.now())
        ]);

        if (!resStructure.ok) throw new Error(`Failed to load structure.json (${resStructure.status})`);
        if (!resInstructions.ok) throw new Error(`Failed to load instructions.json (${resInstructions.status})`);
        if (!resData.ok) throw new Error(`Failed to load data.json (${resData.status})`);

        const structure = await resStructure.json();
        const instructions = await resInstructions.json();
        const data = await resData.json();

        // 2. Display the 3 JSON inputs
        if (codeStructure) codeStructure.textContent = formatJson({ inObj: structure });
        if (codeInstructions) codeInstructions.textContent = formatJson({ inObj: instructions });
        if (codeData) codeData.textContent = formatJson({ inObj: data });

        // 3. Compile structure + instructions + data -> compiled spec JSON (v18 only builds JSON!)
        const startTime = performance.now();
        const compiledSpec = compileStructure({
            inStructure: structure,
            inInstructions: instructions,
            inData: data
        });

        // 4. Display the compiled JSON spec
        if (codeCompiledSpec) codeCompiledSpec.textContent = formatJson({ inObj: compiledSpec });

        // 5. Supply this compiled JSON spec to v14 to build the live DOM!
        renderSpecToDom({
            inSpec: compiledSpec,
            inDomIdToPushTo: renderTargetId
        });
        const elapsed = (performance.now() - startTime).toFixed(2);

        setStatus({ inMessage: `Compiled 3 JSONs & rendered via v14 in ${elapsed}ms` });
    } catch (err) {
        console.error("[Stages Load Error]", err);
        setStatus({ inMessage: `Error: ${err.message}`, inIsError: true });
    }
};

document.getElementById("btn-render-all")?.addEventListener("click", loadAllStages);

// Initial load
loadAllStages();
