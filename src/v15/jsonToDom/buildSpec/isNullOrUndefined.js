export const isNullOrUndefined = ({ inSpec }) => {
    const localSpec = inSpec;
    return localSpec === null || localSpec === undefined;
};

export default isNullOrUndefined;
