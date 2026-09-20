import { buildSpec } from "../../../src/v40/index.js";

const startFunc = async () => {
    try {
        const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node
        const k1 = buildSpec({
            inSpec: spec
        });
        console.log("k1: ", k1[0]);

        const c1 = document.getElementById("form-container");
        c1.appendChild(k1[0]);
    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc();
