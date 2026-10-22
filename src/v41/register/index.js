import meta from "./meta.js";

export const registerGlobal = (appendToDom) => {
    if (!appendToDom) return;

    globalThis.ks ??= {};

    globalThis.ks.jsonToDom = {
        meta,
        appendToDom
    };
};

export default registerGlobal;
