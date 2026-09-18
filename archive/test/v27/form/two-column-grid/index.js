const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Live DOM Node
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "form-container"
        });

        // 2. Static HTML
        const htmlString = window.ks['json-to-dom'].specToHtml({ spec });
        const outputBox = document.getElementById("html-output-box");
        if (outputBox) outputBox.textContent = htmlString;

        // 3. Listeners
        window.ks['json-to-dom'].listeners.bindActions({
            containerId: "form-container",
            actions: {
                save: ({ values }) => {
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-success";
                        statusBadge.textContent = 'Profile Saved Successfully!';
                    }
                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "save",
                            timestamp: new Date().toLocaleTimeString(),
                            profilePayload: values
                        }, null, 2);
                    }
                },
                cancel: ({ reset }) => {
                    reset();
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-warning text-dark";
                        statusBadge.textContent = 'Profile Reset to Blank!';
                    }
                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "cancel",
                            status: "All fields reset"
                        }, null, 2);
                    }
                }
            }
        });

        // 4. Validation
        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) validationBox.textContent = JSON.stringify(validationResult, null, 2);
    } catch (err) {
        console.error("Failed to render two-column grid form:", err);
    }
};

startFunc();
