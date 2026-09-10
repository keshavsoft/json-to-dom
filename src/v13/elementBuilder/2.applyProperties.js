export const applyProperties = ({ inElement, inProperties }) => {
    const localElement = inElement;
    const localProperties = inProperties;

    if (localElement && localProperties && typeof localProperties === "object") {
        Object.assign(localElement, localProperties);
    }

    return localElement;
};

export default applyProperties;
