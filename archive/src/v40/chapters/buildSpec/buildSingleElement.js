import domElementBuilder from "./elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";

export const buildSingleElement = ({ inSpec, inShowLog = false }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    const elementBuilt = domElementBuilder({ inSpec: localSpec });
    let localChildrenNodes = [];

    if ("children" in localSpec) {
        localChildrenNodes = Array.isArray(localSpec.children) && localSpec.children.length > 0
            ? buildChildrenNodes({
                inChildren: localSpec.children,
                inShowLog: localShowLog
            })
            : [];

        elementBuilt.append(...localChildrenNodes);
    };

    return elementBuilt;
};

export default buildSingleElement;
