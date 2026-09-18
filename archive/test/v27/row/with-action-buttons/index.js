const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node (Clean API, pure fast execution, zero validation overhead)
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        // 2. Output 2: Static HTML String (Clean API)
        const htmlString = window.ks['json-to-dom'].specToHtml({
            spec
        });

        const outputBox = document.getElementById("html-output-box");
        if (outputBox) {
            outputBox.textContent = htmlString;
        }

        // 3. Dedicated Event Listener Engine: Hook Button Clicks via Container Delegation
        window.ks['json-to-dom'].listeners.bindActions({
            containerId: "table-container",
            actions: {
                saveVoucher: ({ event, target, row, values }) => {
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-success";
                        statusBadge.textContent = `Action "saveVoucher" Fired!`;
                    }

                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "saveVoucher",
                            timestamp: new Date().toLocaleTimeString(),
                            buttonText: target.textContent.trim(),
                            extractedRowValues: values
                        }, null, 2);
                    }

                    console.log("[v26 listeners] Button Click Handled:", {
                        target,
                        row,
                        values
                    });
                }
            }
        });

        // 4. Standalone Multi-Layer Validation
        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) {
            validationBox.textContent = JSON.stringify(validationResult, null, 2);
        }

        console.log("[v26] Live DOM rendered.");
        console.log("[v26] Static HTML String generated.");
        console.log("[v26] Action listeners hooked to #table-container.");
    } catch (err) {
        console.error("Failed to render v26 sample:", err);
    }
};

startFunc();
