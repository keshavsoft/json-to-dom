export const isDomNode = ({ inSpec }) => {
    const localSpec = inSpec;
    return localSpec instanceof Node;
};

export default isDomNode;
