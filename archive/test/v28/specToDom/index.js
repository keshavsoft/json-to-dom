import { specToDom } from "../../../src/v28/index.js";

const sampleAlertSpec = {
    tagName: "div",
    attributes: {
        class: "alert alert-success d-flex align-items-center gap-3 w-100 shadow-sm border-0 mb-0"
    },
    children: [
        {
            tagName: "strong",
            textContent: "Success!",
            attributes: { class: "fs-5" }
        },
        {
            tagName: "span",
            textContent: "specToDom rendered this DOM element and mounted it directly into #target-mount-container."
        }
    ]
};

document.getElementById("spec-code").textContent = JSON.stringify(sampleAlertSpec, null, 2);

const executeMount = () => {
    try {
        const container = document.getElementById("target-mount-container");
        container.innerHTML = "";

        const rendered = specToDom({
            spec: sampleAlertSpec,
            targetHtmlId: "target-mount-container"
        });

        const badge = document.getElementById("test-status-badge");
        const isMounted = container.contains(rendered);

        if (isMounted) {
            badge.className = "badge bg-success px-3 py-2 fs-6";
            badge.textContent = "PASS: Mounted in #target-mount-container";
        } else {
            badge.className = "badge bg-danger px-3 py-2 fs-6";
            badge.textContent = "FAIL: Not mounted";
        }

        document.getElementById("mount-log").textContent = JSON.stringify({
            targetHtmlId: "target-mount-container",
            elementReturned: rendered.tagName,
            containerChildrenCount: container.children.length,
            isMountedDirectChild: isMounted,
            timestamp: new Date().toLocaleTimeString()
        }, null, 2);
    } catch (error) {
        const badge = document.getElementById("test-status-badge");
        badge.className = "badge bg-danger px-3 py-2 fs-6";
        badge.textContent = "ERROR: " + error.message;
        console.error(error);
    }
};

document.getElementById("btn-retrigger").addEventListener("click", executeMount);
executeMount();
