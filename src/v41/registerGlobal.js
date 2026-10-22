import meta from "./meta.js";

/**
 * 3. registerGlobal - Orchestration Step 3
 * Safely registers the json-to-dom public API onto globalThis.ks in browser / SSR environments.
 */
export const registerGlobal = (inArgs) => {
    const localFuncDefinition = typeof inArgs === "function" ? inArgs : inArgs?.inFuncDefinition;
    if (typeof globalThis === "undefined" || !localFuncDefinition) return;

    globalThis.ks ??= {};
    globalThis.ks["json-to-dom"] = {
        meta,
        buildSpecElement: localFuncDefinition
    };
};

export default registerGlobal;
