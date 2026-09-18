/**
 * 2. registerGlobal - Orchestration Step 2
 * Registers the public API onto window.ks['json-to-dom'] in browser environments.
 */
export const registerGlobal = ({ inApi } = {}) => {
    const localApi = inApi;

    if (typeof window !== "undefined") {
        window.ks = window.ks || {};
        window.ks['json-to-dom'] = localApi;
    }
};

export default registerGlobal;
