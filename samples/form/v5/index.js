import { buildSpec } from "../../../src/v40/index.js";
import { JSDOM } from "jsdom";
import spec from "./spec.json" with { type: "json" };
const { window } = new JSDOM();

const document = window.document;

globalThis.document = document;

const startFunc = async () => {
    try {
        // 1. Output 1: Live DOM Node
        const k1 = buildSpec({
            inSpec: spec
        });
        console.log("k1: ", k1[0]);

        console.log(k1[0].outerHTML);

        const c1 = document.getElementById("form-container");
        c1.appendChild(k1[0]);
    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc().then();
