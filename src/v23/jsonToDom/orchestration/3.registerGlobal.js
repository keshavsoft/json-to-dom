/**
 * 3. registerGlobal - Orchestration Step 3
 * Safely registers the json-to-dom public API onto globalThis.ks in browser / SSR environments.
 */
export const registerGlobal = ({ inApi } = {}) => {
    const localApi = inApi;

    if (typeof globalThis === "undefined" || !localApi) return;

    globalThis.ks ??= {};
    globalThis.ks["json-to-dom"] = localApi;
};

export default registerGlobal;
