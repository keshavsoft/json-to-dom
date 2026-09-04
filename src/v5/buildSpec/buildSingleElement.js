import domElementBuilder from "../elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";
import isTagValid from "./isTagValid.js";

export const buildSingleElement = ({ inSpec }) => {
    const localSpec = inSpec;

    if (!localSpec?.tagName || !isTagValid({ inTagName: localSpec.tagName })) {
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
