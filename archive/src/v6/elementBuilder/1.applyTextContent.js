export const applyTextContent = ({ inElement, inTextContent, inAllowsTextContent = true, inTagName, inShowLog = false }) => {
    const localElement = inElement;
    const localTextContent = inTextContent;
    const localAllowsTextContent = inAllowsTextContent;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!localTextContent) return localElement;

    if (!localAllowsTextContent) {
        if (localShowLog) {
            console.warn(`[json-to-dom] textContent is not allowed on <${localTagName}>; discarded "${localTextContent}"`);
        }
        return localElement;
    }

    localElement.textContent = localTextContent;
    return localElement;
};

export default applyTextContent;
