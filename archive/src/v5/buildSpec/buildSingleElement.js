import domElementBuilder from "../elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";
import isTagValid from "./isTagValid.js";

export const buildSingleElement = ({ inSpec, inShowLog = false }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (!localSpec?.tagName || !isTagValid({ inTagName: localSpec.tagName })) {
        if (localShowLog) {
            console.warn(`[json-to-dom] Not a valid element: "${localSpec?.tagName}"`, localSpec);
        }
        return null;
    }

    const localChildrenNodes = buildChildrenNodes({ inChildren: localSpec.children });

    return domElementBuilder({
        inSpec: {
            ...localSpec,
            children: localChildrenNodes
        }
    });
};

export default buildSingleElement;
