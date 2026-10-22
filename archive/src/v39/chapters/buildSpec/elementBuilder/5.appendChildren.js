export const appendChildren = ({ inElement, inChildren, inAllowsChildren = true, inTagName, inShowLog = false }) => {
    const localElement = inElement;
    const localChildren = inChildren;
    const localAllowsChildren = inAllowsChildren;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!localElement || !Array.isArray(localChildren) || localChildren.length === 0) {
        return localElement;
    }

    if (!localAllowsChildren) {
        if (localShowLog) {
            console.warn(`[json-to-dom v11] Children are not allowed on void tag <${localTagName}>; discarded ${localChildren.length} child nodes.`);
        }
        return localElement;
    }

    localChildren.forEach(child => {
        if (typeof Node !== "undefined" && child instanceof Node) {
            localElement.appendChild(child);
        } else if (typeof child === "string" || typeof child === "number") {
            localElement.appendChild(document.createTextNode(String(child)));
        }
    });

    return localElement;
};

export default appendChildren;
