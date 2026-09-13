/**
 * Chapter 2: Construction Line
 * 
 * Houses the runtime DOM factory and assembly stages:
 * - dispatchSpec: dispatches spec trees to single elements or arrays
 * - elementBuilder: 100% preserved 0 to 5 fabrication steps:
 *   - 0.createElement
 *   - 1.applyTextContent
 *   - 2.applyProperties
 *   - 3.applyAttributes
 *   - 4.applyClassList
 *   - 5.appendChildren
 */
import dispatchSpec, { buildSingleElement, buildSpecArray } from "./buildSpec/index.js";
import elementBuilder from "./elementBuilder/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export {
    dispatchSpec,
    elementBuilder,
    normalizeInput,
    buildSingleElement,
    buildSpecArray
};

export default {
    dispatchSpec,
    elementBuilder,
    normalizeInput,
    buildSingleElement,
    buildSpecArray
};
