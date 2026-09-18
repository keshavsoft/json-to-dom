import domElementBuilder from "../elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";

export const buildSingleElement = ({ inSpec, inShowLog = false }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (!localSpec?.tagName) {
        if (localShowLog) {
            console.warn("[json-to-dom v23] Missing tagName on spec:", localSpec);
        }
        return null;
    }

    const localChildrenNodes = Array.isArray(localSpec.children) && localSpec.children.length > 0
        ? buildChildrenNodes({
            inChildren: localSpec.children,
            inShowLog: localShowLog
        })
        : [];

    return domElementBuilder({
        inSpec: {
            ...localSpec,
            children: localChildrenNodes
        }
    });
};

export default buildSingleElement;
