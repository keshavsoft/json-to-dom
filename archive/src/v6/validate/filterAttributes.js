export const filterAttributes = ({ inAttributes, inAllowedAttributes, inTagName, inShowLog = false }) => {
    const localAttributes = inAttributes;
    const localAllowedAttributes = inAllowedAttributes;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!localAttributes || typeof localAttributes !== "object") return {};
    if (!Array.isArray(localAllowedAttributes)) return localAttributes;

    const filtered = {};
    const discarded = [];

    Object.entries(localAttributes).forEach(([key, val]) => {
        if (localAllowedAttributes.includes(key)) {
            filtered[key] = val;
        } else {
            discarded.push(key);
        }
    });

    if (discarded.length > 0 && localShowLog) {
        console.warn(`[json-to-dom] Discarded invalid attributes for <${localTagName}>:`, discarded);
    }

    return filtered;
};

export default filterAttributes;
