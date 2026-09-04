import domElementBuilder from "../elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";
import isTagValid from "../validate/isTagValid.js";
import getTagDefinition from "../validate/getTagDefinition.js";

export const buildSingleElement = ({ inSpec, inShowLog = false }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (!localSpec?.tagName || !isTagValid({ inTagName: localSpec.tagName })) {
        if (localShowLog) {
            console.warn(`[json-to-dom] Not a valid element: "${localSpec?.tagName}"`, localSpec);
        }
        return null;
    }

    const tagDef = getTagDefinition({ inTagName: localSpec.tagName });

    const localChildrenNodes = tagDef?.allowsChildren
        ? buildChildrenNodes({ inChildren: localSpec.children })
        : [];

    return domElementBuilder({
        inSpec: {
            ...localSpec,
            children: localChildrenNodes
        },
        inTagDef: tagDef,
        inShowLog: localShowLog
    });
};

export default buildSingleElement;
