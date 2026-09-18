export const normalizeText = ({ inText, inCollapseWhitespace = true } = {}) => {
    const localText = inText;
    const localCollapseWhitespace = inCollapseWhitespace;

    if (localText === null || localText === undefined) return null;

    const textAsString = String(localText);

    if (localCollapseWhitespace === false) {
        return textAsString.length > 0 ? textAsString : null;
    }

    const normalizedText = textAsString.replace(/\s+/g, " ").trim();
    return normalizedText.length > 0 ? normalizedText : null;
};

export default normalizeText;
