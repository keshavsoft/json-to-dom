import normalizeInput from "./1.normalizeInput.js";
import registerGlobal from "./2.registerGlobal.js";

/**
 * Orchestration Pipeline:
 * 1. normalizeInput - Resolves user options and spec input
 * 2. registerGlobal - Exposes public API to global environment
 */
export {
    normalizeInput,
    registerGlobal
};

export default {
    normalizeInput,
    registerGlobal
};
