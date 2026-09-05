export const applyProperties = ({ inElement, inProperties }) => {
    const localElement = inElement;
    const localProperties = inProperties;
    if (localProperties) {
        Object.assign(localElement, localProperties);
    }
    return localElement;
};

export default applyProperties;
