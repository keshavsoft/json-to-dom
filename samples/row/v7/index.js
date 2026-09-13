const startFunc = async () => {
    try {
        const spec = await fetch("/samples/row/v7/spec.json").then(res => res.json());

        // Pure W3C HTML Standards DOM Builder (v21)
        window.ks['json-to-dom'].specToDom({
            inSpec: spec,
            inDomIdToPushTo: "table-container"
        });
    } catch (err) {
        console.error("Failed to load spec or render:", err);
    }
};

startFunc();
