import buildSpecElement from "../../../src/v29/index.js";

const sampleSpec = {
    tagName: "div",
    attributes: {
        id: "hero-card",
        class: "card p-4 shadow-sm border-0 bg-primary text-white text-center w-100"
    },
    children: [
        {
            tagName: "h4",
            textContent: "Dynamic Spec Card",
            attributes: { class: "fw-bold mb-2" }
        },
        {
            tagName: "p",
            textContent: "Constructed natively via buildSpecElement using real browser DOM.",
            attributes: { class: "small text-white-50 mb-3" }
        },
        {
            tagName: "button",
            textContent: "Interactive Button",
            attributes: { type: "button", class: "btn btn-light btn-sm fw-semibold" }
        }
    ]
};

document.getElementById("spec-code").textContent = JSON.stringify(sampleSpec, null, 2);

try {
    const element = buildSpecElement({ spec: sampleSpec });

    const container = document.getElementById("dom-preview-container");
    container.innerHTML = "";
    container.appendChild(element);

    const isHtmlElement = element instanceof HTMLElement;
    const badge = document.getElementById("test-status-badge");

    if (isHtmlElement && element.tagName === "DIV") {
        badge.className = "badge bg-success px-3 py-2 fs-6";
        badge.textContent = "PASS: Native DOM Materialized";
    } else {
        badge.className = "badge bg-danger px-3 py-2 fs-6";
        badge.textContent = "FAIL: Invalid DOM Node";
    }

    document.getElementById("dom-inspection").textContent = JSON.stringify({
        tagName: element.tagName,
        nodeType: element.nodeType,
        isInstanceOfHTMLElement: isHtmlElement,
        childElementCount: element.childElementCount,
        className: element.className,
        outerHTMLPreview: element.outerHTML.slice(0, 160) + "..."
    }, null, 2);
} catch (error) {
    const badge = document.getElementById("test-status-badge");
    badge.className = "badge bg-danger px-3 py-2 fs-6";
    badge.textContent = "ERROR: " + error.message;
    console.error(error);
}
