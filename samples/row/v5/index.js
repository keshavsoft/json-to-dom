import spec from "./spec.json" with { type: "json" };

const startFunc = () => {
    // 1. Pure Rendering: json-to-dom only builds DOM elements (zero internal event injection)
    window.ks['json-to-dom'].specToDom({ inSpec: spec, inDomIdToPushTo: "table-container" });

    // 2. Decoupled Interaction: Attach single container-level listener
    addListeners();
};

const addListeners = () => {
    const outputBox = document.getElementById("output-box");

    window.ks['json-to-dom'].listeners.attachRowListener({
        inContainerId: "table-container",
        inOnClick: ({ inOutput, inButton, inClosestElement, inEvent }) => {
            const localOutput = inOutput;
            console.log("Row button clicked via container delegation:", localOutput);

            if (outputBox) {
                outputBox.textContent = `Extracted Output:\n${JSON.stringify({
                    name: localOutput?.name,
                    value: localOutput?.value,
                    values: localOutput?.values
                }, null, 2)}`;
            }
        }
    });
};

startFunc();
