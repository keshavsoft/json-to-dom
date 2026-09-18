import filterAttributes from "../validate/filterAttributes.js";

export const applyAttributes = ({ inElement, inAttributes, inAllowedAttributes, inTagName, inShowLog = false }) => {
    const localElement = inElement;
    const localAttributes = inAttributes;
    const localAllowedAttributes = inAllowedAttributes;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!localElement || !localAttributes || typeof localAttributes !== "object") return localElement;

    const validAttributes = filterAttributes({
        inAttributes: localAttributes,
        inAllowedAttributes: localAllowedAttributes,
        inTagName: localTagName,
        inShowLog: localShowLog
    });

    Object.entries(validAttributes).forEach(([attrName, val]) => {
        if (attrName === "class") {
            localElement.className = val;
        } else if (typeof val === "boolean") {
            if (val) {
                localElement.setAttribute(attrName, "");
            } else {
                localElement.removeAttribute(attrName);
            }
        } else if (val !== undefined && val !== null) {
            localElement.setAttribute(attrName, String(val));
        }
    });

    return localElement;
};

export default applyAttributes;
