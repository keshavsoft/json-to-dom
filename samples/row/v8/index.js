const startFunc = async () => {
    try {
        const spec = await fetch("/samples/row/v8/spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node (Clean API without 'in' prefix)
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        // 2. Output 2: Static HTML String (Clean API without 'in' prefix)
        const htmlString = window.ks['json-to-dom'].specToHtml({
            spec
        });

        const outputBox = document.getElementById("html-output-box");
        if (outputBox) {
            outputBox.textContent = htmlString;
        }

        console.log("[v22] Live DOM rendered.");
        console.log("[v22] Static HTML String generated:\n", htmlString);
    } catch (err) {
        console.error("Failed to render v22 sample:", err);
    }
};

startFunc();
