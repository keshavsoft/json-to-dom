import buildSpecElement, { bindActions } from "../../../src/v30/index.js";

const formSpec = {
    tagName: "div",
    attributes: { class: "ksform" },
    children: [
        {
            tagName: "div",
            attributes: { class: "mb-3" },
            children: [
                {
                    tagName: "label",
                    textContent: "Party Name",
                    attributes: { class: "form-label small fw-semibold text-muted" }
                },
                {
                    tagName: "input",
                    attributes: {
                        name: "partyName",
                        type: "text",
                        value: "Acme Enterprises",
                        class: "form-control"
                    }
                }
            ]
        },
        {
            tagName: "div",
            attributes: { class: "mb-3" },
            children: [
                {
                    tagName: "label",
                    textContent: "Total Amount (₹)",
                    attributes: { class: "form-label small fw-semibold text-muted" }
                },
                {
                    tagName: "input",
                    attributes: {
                        name: "totalAmount",
                        type: "number",
                        value: "54200",
                        class: "form-control"
                    }
                }
            ]
        },
        {
            tagName: "div",
            attributes: { class: "d-flex gap-2 justify-content-end pt-2 border-top" },
            children: [
                {
                    tagName: "button",
                    textContent: "Cancel / Reset",
                    attributes: {
                        type: "button",
                        class: "btn btn-outline-secondary btn-sm px-3",
                        "data-action": "cancel"
                    }
                },
                {
                    tagName: "button",
                    textContent: "Save Voucher",
                    attributes: {
                        type: "button",
                        class: "btn btn-success btn-sm px-4 fw-semibold",
                        "data-action": "save"
                    }
                }
            ]
        }
    ]
};

const formElement = buildSpecElement({ spec: formSpec });
const container = document.getElementById("form-container");
container.appendChild(formElement);

bindActions({
    container: formElement,
    actions: {
        save: ({ values, form }) => {
            const statusBadge = document.getElementById("action-status-badge");
            statusBadge.className = "badge bg-success px-3 py-2 fs-6";
            statusBadge.textContent = "PASS: Save Action Captured!";

            const typeBadge = document.getElementById("event-type-badge");
            typeBadge.className = "badge bg-success";
            typeBadge.textContent = "Action: save";

            document.getElementById("action-payload-box").textContent = JSON.stringify({
                action: "save",
                timestamp: new Date().toLocaleTimeString(),
                formValues: values
            }, null, 2);
        },
        cancel: ({ reset, form }) => {
            reset();

            const statusBadge = document.getElementById("action-status-badge");
            statusBadge.className = "badge bg-warning text-dark px-3 py-2 fs-6";
            statusBadge.textContent = "PASS: Form Reset / Cancelled!";

            const typeBadge = document.getElementById("event-type-badge");
            typeBadge.className = "badge bg-warning text-dark";
            typeBadge.textContent = "Action: cancel";

            document.getElementById("action-payload-box").textContent = JSON.stringify({
                action: "cancel",
                timestamp: new Date().toLocaleTimeString(),
                status: "All input fields reset to blank"
            }, null, 2);
        }
    }
});
