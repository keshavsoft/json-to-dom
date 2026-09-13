export const isDomNode = ({ inSpec }) => {
    const localSpec = inSpec;
    return typeof Node !== "undefined" && localSpec instanceof Node;
};

export default isDomNode;
