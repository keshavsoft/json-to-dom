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
        class: "card shadow-sm border-primary-subtle"
    },
    children: [
        {
            tagName: "div",
            textContent: "Bootstrap 5 Sample",
            attributes: {
                class: "card-header bg-primary text-white fw-semibold"
            }
        },
        {
            tagName: "div",
            attributes: {
                class: "card-body"
            },
            children: [
                {
                    tagName: "h2",
                    textContent: "Customer Profile",
                    attributes: {
                        class: "h5 card-title"
                    }
                },
                {
                    tagName: "p",
                    textContent: "This sample shows how the same JSON spec format can render Bootstrap 5 components in the preview panel.",
                    attributes: {
                        class: "card-text text-body-secondary"
                    }
                },
                {
                    tagName: "div",
                    attributes: {
                        class: "mb-3"
                    },
                    children: [
                        {
                            tagName: "label",
                            textContent: "User Name",
                            attributes: {
                                for: "bootstrap-sample-user-name",
                                class: "form-label"
                            }
                        },
                        {
                            tagName: "input",
                            attributes: {
                                id: "bootstrap-sample-user-name",
                                type: "text",
                                placeholder: "Enter user name",
                                class: "form-control"
                            }
                        }
                    ]
                },
                {
                    tagName: "div",
                    attributes: {
                        class: "d-flex flex-wrap gap-2"
                    },
                    children: [
                        {
                            tagName: "button",
                            textContent: "Save",
                            attributes: {
                                type: "button",
                                class: "btn btn-primary"
                            }
                        },
                        {
                            tagName: "button",
                            textContent: "Cancel",
                            attributes: {
                                type: "button",
                                class: "btn btn-outline-secondary"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const setStatus = ({ inText, inIsError = false } = {}) => {
    if (!statusMessage) return;

    statusMessage.textContent = inText || "";
    statusMessage.className = inIsError
        ? "small mb-0 mt-3 text-danger"
        : "small mb-0 mt-3 text-body-secondary";
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
    setStatus({ inText: "Bootstrap sample JSON loaded. Click Build DOM to render it." });
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
