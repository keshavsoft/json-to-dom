const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node
        window.ks['json-to-dom'].buildSpecElement({
            spec,
            domIdToPushTo: "form-container"
        });
    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc();
