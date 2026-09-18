import domElementBuilder from "./elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";

export const buildSingleElement = ({ raka, inShowLog = false }) => {
    const localChildrenNodes = Array.isArray(raka.children) && raka.children.length > 0
        ? buildChildrenNodes({
            inChildren: raka.children,
            inShowLog
        })
        : [];

    return domElementBuilder({
        raka: {
            ...raka,
            children: localChildrenNodes
        }
    });

};

export default buildSingleElement;
