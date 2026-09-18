import { domToSpec, getStartSpec } from "./index.js";

const outputElement = document.getElementById("reverse-output");
const reverseButton = document.getElementById("reverse-start-btn");
const clearButton = document.getElementById("reverse-clear-btn");

const showSpec = ({ inSpec } = {}) => {
    const localSpec = inSpec;
    const jsonText = JSON.stringify(localSpec, null, 2);

    if (outputElement) {
        outputElement.textContent = jsonText;
    }

    return localSpec;
};

const reverseStart = () => {
    const startSpec = getStartSpec();

    globalThis.startSpec = startSpec;
    globalThis.domToSpecV13 = ({ inNode }) => domToSpec({ inNode });

    console.log("[json-to-dom v13 reverse] #start -> spec", startSpec);

    return showSpec({ inSpec: startSpec });
};

reverseButton?.addEventListener("click", reverseStart);
clearButton?.addEventListener("click", () => {
    if (outputElement) {
        outputElement.textContent = "";
    }
});

reverseStart();
