export const appendChildren = ({ inElement, inChildren, inAllowsChildren = true, inTagName, inShowLog = false }) => {
    const localElement = inElement;
    const localChildren = inChildren;
    const localAllowsChildren = inAllowsChildren;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!Array.isArray(localChildren) || localChildren.length === 0) return localElement;

    if (!localAllowsChildren) {
        if (localShowLog) {
            console.warn(`[json-to-dom] children are not allowed on <${localTagName}>; discarded ${localChildren.length} child nodes`);
        }
        return localElement;
    }

    localChildren.forEach(child => {
        if (child instanceof Node) {
            localElement.appendChild(child);
        }
    });

    return localElement;
};

export default appendChildren;
