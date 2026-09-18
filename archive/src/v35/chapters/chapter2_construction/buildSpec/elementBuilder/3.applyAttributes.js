export const applyAttributes = ({ inElement, inAttributes }) => {
    const localElement = inElement;
    const localAttributes = inAttributes;

    if (!localElement || !localAttributes || typeof localAttributes !== "object") return localElement;

    Object.entries(localAttributes).forEach(([attrName, val]) => {
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
