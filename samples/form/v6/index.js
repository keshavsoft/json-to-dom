import spec from "./spec.json" with { type: "json" };
// import { buildSpec } from "../../../src/v40/index.js";
const startFunc = async () => {
    try {
        window.ks['json-to-dom'].buildSpecElement({ targetHtmlId: "form-container", inSpec: spec })
        // const k1 = buildSpec({
        //     inSpec: spec
        // });
    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc().then();
