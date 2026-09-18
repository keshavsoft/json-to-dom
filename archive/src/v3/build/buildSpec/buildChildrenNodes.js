import buildSpecElement from "../buildSpecElement.js";

export const buildChildrenNodes = ({ inChildren }) => {
    const localChildren = inChildren;
    if (!Array.isArray(localChildren)) return [];
    return localChildren.map(child => buildSpecElement(child)).flat().filter(Boolean);
};

export default buildChildrenNodes;
