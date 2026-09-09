import isAttributeAllowed from "./isAttributeAllowed.js";

export const filterAttributes = ({ inAttributes, inAllowedAttributes, inTagName, inShowLog = false }) => {
    const localAttributes = inAttributes;
    const localAllowedAttributes = inAllowedAttributes;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!localAttributes || typeof localAttributes !== "object") return {};

    const filtered = {};
    const discarded = [];

    Object.entries(localAttributes).forEach(([key, val]) => {
        if (isAttributeAllowed({ inAttributeName: key, inAllowedAttributes: localAllowedAttributes })) {
            filtered[key] = val;
        } else {
            discarded.push(key);
        }
    });

    if (discarded.length > 0 && localShowLog) {
        console.warn(`[json-to-dom v10] Discarded invalid attributes for <${localTagName}>:`, discarded);
    }

    return filtered;
};

export default filterAttributes;
