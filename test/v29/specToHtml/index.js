import { specToHtml } from "../../../src/v28/index.js";

const sampleTableSpec = {
    tagName: "table",
    attributes: {
        class: "table table-striped table-hover align-middle mb-0 border"
    },
    children: [
        {
            tagName: "thead",
            attributes: { class: "table-dark" },
            children: [
                {
                    tagName: "tr",
                    children: [
                        { tagName: "th", textContent: "SKU" },
                        { tagName: "th", textContent: "Item Name" },
                        { tagName: "th", textContent: "Status", attributes: { class: "text-end" } }
                    ]
                }
            ]
        },
        {
            tagName: "tbody",
            children: [
                {
                    tagName: "tr",
                    children: [
                        { tagName: "td", textContent: "SKU-100", attributes: { class: "font-monospace" } },
                        { tagName: "td", textContent: "Wireless Keyboard" },
                        { tagName: "td", textContent: "In Stock", attributes: { class: "text-end text-success fw-bold" } }
                    ]
                },
                {
                    tagName: "tr",
                    children: [
                        { tagName: "td", textContent: "SKU-101", attributes: { class: "font-monospace" } },
                        { tagName: "td", textContent: "Ergonomic Mouse" },
                        { tagName: "td", textContent: "Low Stock", attributes: { class: "text-end text-warning fw-bold" } }
                    ]
                }
            ]
        }
    ]
};

document.getElementById("spec-code").textContent = JSON.stringify(sampleTableSpec, null, 2);

try {
    const htmlString = specToHtml({ spec: sampleTableSpec });

    document.getElementById("html-string-output").textContent = htmlString;
    document.getElementById("char-count-badge").textContent = `${htmlString.length} chars`;

    const preview = document.getElementById("html-live-preview");
    preview.innerHTML = htmlString;

    const badge = document.getElementById("test-status-badge");
    if (typeof htmlString === "string" && htmlString.startsWith("<table") && htmlString.endsWith("</table>")) {
        badge.className = "badge bg-success px-3 py-2 fs-6";
        badge.textContent = "PASS: Valid HTML String Generated";
    } else {
        badge.className = "badge bg-danger px-3 py-2 fs-6";
        badge.textContent = "FAIL: Invalid HTML String";
    }
} catch (error) {
    const badge = document.getElementById("test-status-badge");
    badge.className = "badge bg-danger px-3 py-2 fs-6";
    badge.textContent = "ERROR: " + error.message;
    console.error(error);
}
