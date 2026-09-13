const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        const htmlString = window.ks['json-to-dom'].specToHtml({ spec });
        const outputBox = document.getElementById("html-output-box");
        if (outputBox) outputBox.textContent = htmlString;

        const validationResult = window.ks['json-to-dom'].validate.v2({ spec });
        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) validationBox.textContent = JSON.stringify(validationResult, null, 2);

        console.log("[Table Striped Bordered] Rendered successfully.");
    } catch (err) {
        console.error("Failed to render striped table:", err);
    }
};

startFunc();
