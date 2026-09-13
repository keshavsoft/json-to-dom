const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Live DOM Node
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        // 2. Static HTML String
        const htmlString = window.ks['json-to-dom'].specToHtml({ spec });
        const outputBox = document.getElementById("html-output-box");
        if (outputBox) outputBox.textContent = htmlString;

        // 3. Listeners
        window.ks['json-to-dom'].listeners.bindActions({
            containerId: "table-container",
            actions: {
                selectRow: ({ target, values }) => {
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-success";
                        statusBadge.textContent = `Row Selected: ${values.voucherNo}`;
                    }

                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "selectRow",
                            timestamp: new Date().toLocaleTimeString(),
                            selectedRecord: values
                        }, null, 2);
                    }
                }
            }
        });

        // 4. Multi-Layer Validation
        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) validationBox.textContent = JSON.stringify(validationResult, null, 2);
    } catch (err) {
        console.error("Failed to render table with actions:", err);
    }
};

startFunc();
