import render from "https://keshavsoft.github.io/json-to-dom/dist/v42/min.js";

const fileInput = document.getElementById("jsonFileInput");
const btnSampleSpec = document.getElementById("btnSampleSpec");
const btnLoadSession = document.getElementById("btnLoadSession");
const outputContainer = document.getElementById("outputContainer");
const activeFileNameBadge = document.getElementById("activeFileNameBadge");

const SAMPLE_SPEC = {
    tagName: "div",
    classList: "card p-4 shadow-sm bg-white border",
    children: [
        {
            tagName: "div",
            classList: "d-flex justify-content-between align-items-center mb-3",
            children: [
                { tagName: "h4", classList: "text-primary fw-bold mb-0", textContent: "Sample Specification" },
                { tagName: "span", classList: "badge bg-success-subtle text-success border border-success-subtle", textContent: "Rendered Component" }
            ]
        },
        {
            tagName: "p",
            classList: "text-muted small mb-3",
            textContent: "This component was rendered directly from a JSON specification using buildSpecElement."
        },
        {
            tagName: "div",
            classList: "mb-3",
            children: [
                {
                    tagName: "label",
                    classList: "form-label small fw-semibold text-secondary",
                    textContent: "Sample Input Field"
                },
                {
                    tagName: "input",
                    classList: "form-control form-control-sm",
                    attributes: { type: "text", placeholder: "Type something...", value: "Pre-filled text" }
                }
            ]
        },
        {
            tagName: "div",
            classList: "d-flex gap-2",
            children: [
                {
                    tagName: "button",
                    classList: "btn btn-primary btn-sm px-3",
                    textContent: "Submit Action",
                    attributes: { type: "button" }
                },
                {
                    tagName: "button",
                    classList: "btn btn-outline-secondary btn-sm px-3",
                    textContent: "Reset",
                    attributes: { type: "button" }
                }
            ]
        }
    ]
};

const renderSpec = ({ inSpec, inFileName }) => {
    const localSpec = inSpec;
    const localFileName = inFileName ?? "Custom Spec";

    try {
        sessionStorage.setItem("json_to_tag_active_spec", JSON.stringify(localSpec));
        sessionStorage.setItem("json_to_tag_active_name", localFileName);
        if (activeFileNameBadge) {
            activeFileNameBadge.textContent = localFileName;
        }

        const rendered = render({
            jsonSpec: localSpec,
            targetHtmlId: "outputContainer", appendPosition: "append"
        });
    } catch (err) {
        alert("Error rendering JSON: " + err.message);
        console.error(err);
    }
};

// Check if session storage has a previously analyzed spec
const checkSessionSpec = () => {
    try {
        const savedSpec = sessionStorage.getItem("json_to_tag_active_spec");
        const savedName = sessionStorage.getItem("json_to_tag_active_name") || "Analyzed Spec";
        if (savedSpec && btnLoadSession) {
            btnLoadSession.style.display = "inline-block";
            btnLoadSession.title = `Load "${savedName}" from Tag Analysis`;
        }
    } catch (e) {
        // Ignore session read errors
    }
};

btnLoadSession.addEventListener("click", () => {
    try {
        const savedSpec = sessionStorage.getItem("json_to_tag_active_spec");
        const savedName = sessionStorage.getItem("json_to_tag_active_name") || "Analyzed Spec";
        if (savedSpec) {
            const parsed = JSON.parse(savedSpec);
            renderSpec({ inSpec: parsed, inFileName: savedName });
        }
    } catch (err) {
        alert("Failed to load spec from session: " + err.message);
    }
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target.result);
            renderSpec({ inSpec: json, inFileName: file.name });
        } catch (err) {
            alert("Invalid JSON file: " + err.message);
        }
    };
    reader.readAsText(file);
});

if (btnSampleSpec) {
    btnSampleSpec.addEventListener("click", () => {
        renderSpec({ inSpec: SAMPLE_SPEC, inFileName: "Sample Spec" });
    });
}

checkSessionSpec();