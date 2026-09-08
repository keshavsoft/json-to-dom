export const isSpecObject = ({ inSpec }) => {
    const localSpec = inSpec;
    return typeof localSpec === "object" && localSpec !== null;
};

export default isSpecObject;
