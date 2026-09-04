export const applyAttributes = ({ inElement, inAttributes }) => {
    const localElement = inElement;
    const localAttributes = inAttributes;
    if (localAttributes) {
        Object.entries(localAttributes).forEach(([attrName, val]) => {
            if (attrName === "class") {
                localElement.className = val;
            } else {
                localElement.setAttribute(attrName, val);
            }
        });
    }
    return localElement;
};

export default applyAttributes;
