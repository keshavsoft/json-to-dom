const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        // 2. Output 2: Static HTML String
        const htmlString = window.ks['json-to-dom'].specToHtml({
            spec
        });

        const outputBox = document.getElementById("html-output-box");
        if (outputBox) {
            outputBox.textContent = htmlString;
        }

        // 3. Validation
        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) {
            validationBox.textContent = JSON.stringify(validationResult, null, 2);
        }

        console.log("[Row Simple Inputs] Rendered cleanly with v27.");
    } catch (err) {
        console.error("Failed to render simple inputs row:", err);
    }
};

startFunc();
