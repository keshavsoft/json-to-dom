export const add = ({ inValues = [] } = {}) => {
    const localValues = inValues;

    if (!Array.isArray(localValues)) return 0;

    return localValues.reduce((acc, v) => {
        const val = Number(v);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);
};

export default add;
