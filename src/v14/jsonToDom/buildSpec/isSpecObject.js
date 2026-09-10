export const isSpecObject = ({ inSpec }) => {
    const localSpec = inSpec;
    return typeof localSpec === "object" && localSpec !== null && !Array.isArray(localSpec);
};

export default isSpecObject;
