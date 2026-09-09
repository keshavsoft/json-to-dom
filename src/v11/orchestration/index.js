import normalizeInput from "./1.normalizeInput.js";
import dispatchSpec from "./2.dispatchSpec.js";
import registerGlobal from "./3.registerGlobal.js";

/**
 * Orchestration Story Pipeline:
 * 1. normalizeInput - Resolves user options and spec input
 * 2. dispatchSpec   - Builds appropriate DOM tree based on spec shape
 * 3. registerGlobal - Exposes public API to global environment
 */
export {
    normalizeInput,
    dispatchSpec,
    registerGlobal
};

export default {
    normalizeInput,
    dispatchSpec,
    registerGlobal
};
