export const isSpecArray = ({ inSpec }) => {
    const localSpec = inSpec;
    return Array.isArray(localSpec);
};

export default isSpecArray;
