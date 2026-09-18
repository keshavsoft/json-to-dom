export const isNullOrUndefined = ({ inSpec }) => {
    const localSpec = inSpec;
    return localSpec === null || localSpec === undefined;
};

export const isDomNode = ({ inSpec }) => {
    const localSpec = inSpec;
    return typeof Node !== "undefined" && localSpec instanceof Node;
};

export const isSpecArray = ({ inSpec }) => {
    const localSpec = inSpec;
    return Array.isArray(localSpec);
};

export const isSpecObject = ({ inSpec }) => {
    const localSpec = inSpec;
    return typeof localSpec === "object" && localSpec !== null && !Array.isArray(localSpec);
};

export default {
    isNullOrUndefined,
    isDomNode,
    isSpecArray,
    isSpecObject
};
