import domElementBuilder from "../elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";

export const buildSingleElement = ({ inSpec }) => {
    const localSpec = inSpec;
    const localChildrenNodes = buildChildrenNodes({ inChildren: localSpec.children });

    return domElementBuilder({
        inSpec: {
            ...localSpec,
            children: localChildrenNodes
        }
    });
};

export default buildSingleElement;
