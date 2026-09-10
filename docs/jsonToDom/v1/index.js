import { buildSpecElement } from "../../dist/v14/min.js";

const fileInput = document.getElementById("json-file-input");
const buildButton = document.getElementById("build-dom-btn");
const loadSampleButton = document.getElementById("load-sample-btn");
const clearJsonButton = document.getElementById("clear-json-btn");
const clearDomButton = document.getElementById("clear-dom-btn");
const jsonEditor = document.getElementById("json-editor");
const domPreview = document.getElementById("dom-preview");
const statusMessage = document.getElementById("status-message");

const sampleSpec = {
    tagName: "div",
    attributes: {
        class: "mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    },
    children: [
        {
            tagName: "h2",
            textContent: "Uploaded JSON Sample",
            attributes: {
                class: "text-xl font-bold text-slate-800"
            }
        },
        {
            tagName: "p",
            textContent: "This sample shows how your JSON spec becomes live DOM in the preview panel.",
            attributes: {
                class: "mt-2 text-sm text-slate-500"
            }
        },
        {
            tagName: "div",
            attributes: {
                class: "mt-5 grid gap-3"
            },
            children: [
                {
                    tagName: "label",
                    textContent: "User Name",
                    attributes: {
                        for: "sample-user-name",
                        class: "block text-sm font-semibold text-slate-700"
                    }
                },
                {
                    tagName: "input",
                    attributes: {
                        id: "sample-user-name",
                        type: "text",
                        placeholder: "Enter user name",
                        class: "w-full rounded-lg border border-slate-300 px-3 py-2"
                    }
                },
                {
                    tagName: "button",
                    textContent: "Save",
                    attributes: {
                        type: "button",
                        class: "inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    }
                }
            ]
        }
    ]
};

const setStatus = ({ inText, inIsError = false } = {}) => {
    if (!statusMessage) return;

    statusMessage.textContent = inText || "";
    statusMessage.className = inIsError
        ? "text-sm text-rose-600"
        : "text-sm text-slate-500";
};

const setBuildEnabled = ({ inEnabled } = {}) => {
    if (!buildButton) return;
    buildButton.disabled = !inEnabled;
};

const clearPreview = () => {
    if (domPreview) {
        domPreview.innerHTML = "";
    }
};

const readTextFile = ({ inFile } = {}) => {
    const localFile = inFile;

    if (!localFile) {
        return Promise.resolve("");
    }

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = () => resolve(String(fileReader.result || ""));
        fileReader.onerror = () => reject(fileReader.error || new Error("Could not read file"));

        fileReader.readAsText(localFile);
    });
};

const getParsedSpec = () => {
    const rawJson = jsonEditor?.value?.trim();

    if (!rawJson) {
        setStatus({ inText: "Please upload or enter JSON first.", inIsError: true });
        return null;
    }

    try {
        return JSON.parse(rawJson);
    } catch (error) {
        setStatus({ inText: `Invalid JSON: ${error.message}`, inIsError: true });
        return null;
    }
};

const renderSpec = ({ inSpec } = {}) => {
    const localSpec = inSpec;

    if (localSpec === null || localSpec === undefined) {
        setStatus({ inText: "Parsed JSON is empty.", inIsError: true });
        return null;
    }

    clearPreview();

    const builtNode = buildSpecElement({
        inSpec: localSpec,
        inApplyEvents: false
    });

    if (!builtNode) {
        setStatus({ inText: "Could not build DOM from the supplied JSON.", inIsError: true });
        return null;
    }

    if (Array.isArray(builtNode)) {
        domPreview?.append(...builtNode);
    } else {
        domPreview?.appendChild(builtNode);
    }

    globalThis.lastUploadedSpec = localSpec;
    globalThis.lastBuiltDom = builtNode;

    setStatus({ inText: "DOM built successfully from JSON." });
    return builtNode;
};

const handleBuildClick = () => {
    const parsedSpec = getParsedSpec();
    if (parsedSpec === null) return;

    renderSpec({ inSpec: parsedSpec });
};

const handleFileChange = async () => {
    const selectedFile = fileInput?.files?.[0];

    if (!selectedFile) {
        setBuildEnabled({ inEnabled: Boolean(jsonEditor?.value?.trim()) });
        setStatus({ inText: "No file selected." });
        return;
    }

    try {
        const fileText = await readTextFile({ inFile: selectedFile });
        if (jsonEditor) {
            jsonEditor.value = fileText;
        }
        setBuildEnabled({ inEnabled: true });
        setStatus({ inText: `Loaded ${selectedFile.name}. Click Build DOM to render it.` });
    } catch (error) {
        setBuildEnabled({ inEnabled: false });
        setStatus({ inText: `Could not read file: ${error.message}`, inIsError: true });
    }
};

const loadSample = () => {
    if (jsonEditor) {
        jsonEditor.value = JSON.stringify(sampleSpec, null, 2);
    }
    setBuildEnabled({ inEnabled: true });
    setStatus({ inText: "Sample JSON loaded. Click Build DOM to render it." });
};

const clearJson = () => {
    if (jsonEditor) {
        jsonEditor.value = "";
    }
    if (fileInput) {
        fileInput.value = "";
    }
    setBuildEnabled({ inEnabled: false });
    setStatus({ inText: "JSON cleared." });
};

fileInput?.addEventListener("change", handleFileChange);
buildButton?.addEventListener("click", handleBuildClick);
loadSampleButton?.addEventListener("click", loadSample);
clearJsonButton?.addEventListener("click", clearJson);
clearDomButton?.addEventListener("click", () => {
    clearPreview();
    setStatus({ inText: "DOM preview cleared." });
});
jsonEditor?.addEventListener("input", () => {
    setBuildEnabled({ inEnabled: Boolean(jsonEditor.value.trim()) });
});

setBuildEnabled({ inEnabled: false });
