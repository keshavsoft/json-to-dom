const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "form-container"
        });

        const htmlString = window.ks['json-to-dom'].specToHtml({ spec });
        const outputBox = document.getElementById("html-output-box");
        if (outputBox) outputBox.textContent = htmlString;

        window.ks['json-to-dom'].listeners.bindActions({
            containerId: "form-container",
            actions: {
                save: ({ values }) => {
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-success";
                        statusBadge.textContent = 'Payment Authorized!';
                    }
                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "save",
                            timestamp: new Date().toLocaleTimeString(),
                            authorizedPayload: values
                        }, null, 2);
                    }
                },
                cancel: ({ reset }) => {
                    reset();
                    const statusBadge = document.getElementById("action-status-badge");
                    if (statusBadge) {
                        statusBadge.className = "badge bg-warning text-dark";
                        statusBadge.textContent = 'Form Reset';
                    }
                    const resultBox = document.getElementById("action-result-box");
                    if (resultBox) {
                        resultBox.textContent = JSON.stringify({
                            action: "cancel",
                            status: "Cleared all inputs"
                        }, null, 2);
                    }
                }
            }
        });

        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) validationBox.textContent = JSON.stringify(validationResult, null, 2);
    } catch (err) {
        console.error("Failed to render stacked vertical form:", err);
    }
};

startFunc();
