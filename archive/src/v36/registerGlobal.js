import meta from "./meta.js";

/**
 * 3. registerGlobal - Orchestration Step 3
 * Safely registers the json-to-dom public API onto globalThis.ks in browser / SSR environments.
 */
export const registerGlobal = (inFuncDefinition) => {
    if (typeof globalThis === "undefined" || !inFuncDefinition) return;

    globalThis.ks ??= {};
    globalThis.ks["json-to-dom"] = {
        meta,
        buildSpecElement: inFuncDefinition
    };
};

export default registerGlobal;
