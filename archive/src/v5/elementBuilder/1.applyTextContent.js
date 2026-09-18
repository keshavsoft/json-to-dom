export const applyTextContent = ({ inElement, inTextContent }) => {
    const localElement = inElement;
    const localTextContent = inTextContent;
    if (localTextContent) {
        localElement.textContent = localTextContent;
    }
    return localElement;
};

export default applyTextContent;
