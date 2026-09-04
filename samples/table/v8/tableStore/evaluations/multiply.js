export const multiply = ({ inValue = 0, inFactor = 1 } = {}) => {
    const localValue = Number(inValue) || 0;
    const localFactor = Number(inFactor) || 0;

    return localValue * localFactor;
};

export default multiply;
