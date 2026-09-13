const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "form-container"
        });

        // 2. Output 2: Static HTML String
        const htmlString = window.ks['json-to-dom'].specToHtml({
            spec
        });

        const outputBox = document.getElementById("html-output-box");
        if (outputBox) {
            outputBox.textContent = htmlString;
        }

        // 3. Dedicated Event Listener Engine v27: Hook Footer Actions (Save & Cancel)
        window.ks['json-to-dom'].listeners.bindActions({
            containerId: "form-container",
            actions: {
                save: ({ event, target, form, values }) => {
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-success";
                        statusBadge.textContent = 'Action "save" Fired! Payload Extracted';
                    }

                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "save",
                            timestamp: new Date().toLocaleTimeString(),
                            totalFieldsExtracted: Object.keys(values).length,
                            formData: values
                        }, null, 2);
                    }

                    console.log("[v27 listeners.v2] Footer Save Handled:", {
                        target,
                        form,
                        values
                    });
                },
                cancel: ({ event, target, form, values, reset }) => {
                    // Call built-in form reset
                    reset();

                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-warning text-dark";
                        statusBadge.textContent = 'Action "cancel" Fired! Form Reset to Empty';
                    }

                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "cancel",
                            timestamp: new Date().toLocaleTimeString(),
                            status: "Form inputs cleared and reset",
                            clearedValues: window.ks['json-to-dom'].listeners.extractFormValues({ container: form })
                        }, null, 2);
                    }

                    console.log("[v27 listeners.v2] Footer Cancel Handled - Form Reset.");
                }
            }
        });

        // 4. Standalone Multi-Layer Validation
        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) {
            validationBox.textContent = JSON.stringify(validationResult, null, 2);
        }

        console.log("[v27] Form rendered with footer actions.");
        console.log("[v27] Static HTML string generated.");
        console.log("[v27] Listeners bound to #form-container.");
    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc();
