import domElementBuilder from "../elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";
import isTagValid from "../validate/isTagValid.js";
import getTagDefinition from "../validate/getTagDefinition.js";

export const buildSingleElement = ({ inSpec, inApplyEvents = false, inShowLog = false }) => {
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!localSpec?.tagName || !isTagValid({ inTagName: localSpec.tagName })) {
        if (localShowLog) {
            console.warn(`[json-to-dom v10] Not a valid element: "${localSpec?.tagName}"`, localSpec);
        }
        return null;
    }

    const tagDef = getTagDefinition({ inTagName: localSpec.tagName });

    const localChildrenNodes = tagDef?.allowsChildren
        ? buildChildrenNodes({
            inChildren: localSpec.children,
            inApplyEvents: localApplyEvents,
            inShowLog: localShowLog
        })
        : [];

    return domElementBuilder({
        inSpec: {
            ...localSpec,
            children: localChildrenNodes
        },
        inTagDef: tagDef,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });
};

export default buildSingleElement;
