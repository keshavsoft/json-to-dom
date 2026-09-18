import domToSpec from "./domToSpec.js";

export const getStartSpec = ({ inDocument = document, inCollapseWhitespace = true } = {}) => {
    const localDocument = inDocument;
    const localCollapseWhitespace = inCollapseWhitespace;

    const startElement = localDocument?.getElementById?.("start");

    return domToSpec({
        inNode: startElement,
        inCollapseWhitespace: localCollapseWhitespace
    });
};

export default getStartSpec;
