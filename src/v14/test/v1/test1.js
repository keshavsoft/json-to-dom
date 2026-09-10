import { domToSpec } from "./index.js";

const toolSelector = "[data-reverse-tool='true']";
const idInput = document.getElementById("reverse-id-input");
const idsList = document.getElementById("reverse-ids-list");
const downloadButton = document.getElementById("reverse-download-btn");
const outputElement = document.getElementById("reverse-output");
const statusElement = document.getElementById("reverse-status");

const setStatus = ({ inText, inIsError = false } = {}) => {
    if (!statusElement) return;

    statusElement.textContent = inText || "";
    statusElement.className = inIsError
        ? "text-xs text-rose-600"
        : "text-xs text-slate-500";
};

const showSpec = ({ inSpec } = {}) => {
    const localSpec = inSpec;
    const jsonText = JSON.stringify(localSpec, null, 2);

    if (outputElement) {
        outputElement.textContent = jsonText;
    }

    return jsonText;
};

const getAvailableIds = () => {
    return [...new Set(
        Array.from(document.querySelectorAll("[id]"))
            .filter((element) => !element.closest(toolSelector))
            .map((element) => element.id)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
    )];
};

const populateIdsList = () => {
    const availableIds = getAvailableIds();

    if (idsList) {
        idsList.innerHTML = "";

        availableIds.forEach((currentId) => {
            const option = document.createElement("option");
            option.value = currentId;
            idsList.appendChild(option);
        });
    }

    if (idInput && !idInput.value) {
        idInput.value = availableIds.includes("start") ? "start" : availableIds[0] || "";
    }

    setStatus({ inText: `${availableIds.length} ids available for reverse.` });

    return availableIds;
};

const getSpecFromSelectedId = () => {
    const selectedId = idInput?.value?.trim();

    if (!selectedId) {
        setStatus({ inText: "Please select an id first.", inIsError: true });
        return null;
    }

    const targetElement = document.getElementById(selectedId);

    if (!targetElement) {
        setStatus({ inText: `Could not find an element with id \"${selectedId}\".`, inIsError: true });
        return null;
    }

    const spec = domToSpec({ inNode: targetElement });

    if (!spec) {
        setStatus({ inText: `Could not reverse id \"${selectedId}\" into JSON.`, inIsError: true });
        return null;
    }

    return {
        id: selectedId,
        element: targetElement,
        spec
    };
};

const toSafeFileName = ({ inId } = {}) => {
    const localId = inId || "reverse-spec";
    return `${localId.replace(/[\\/:*?"<>|]/g, "_")}.json`;
};

const downloadTextFile = ({ inFileName, inText } = {}) => {
    const blob = new Blob([inText], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = inFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
};

const handleDownload = () => {
    const reverseResult = getSpecFromSelectedId();
    if (!reverseResult) return;

    const jsonText = showSpec({ inSpec: reverseResult.spec });
    const fileName = toSafeFileName({ inId: reverseResult.id });

    downloadTextFile({
        inFileName: fileName,
        inText: jsonText
    });

    globalThis.lastReverseId = reverseResult.id;
    globalThis.lastReverseSpec = reverseResult.spec;
    globalThis.domToSpecV14 = ({ inNode }) => domToSpec({ inNode });

    console.log(`[json-to-dom v14 reverse] #${reverseResult.id} -> spec`, reverseResult.spec);
    setStatus({ inText: `Downloaded ${fileName}` });
};

downloadButton?.addEventListener("click", handleDownload);
idInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleDownload();
    }
});

populateIdsList();
