export const percent = ({ inValue = 0, inRate = 0 } = {}) => {
    const localValue = Number(inValue) || 0;
    const localRate = Number(inRate) || 0;

    return (localValue * localRate) / 100;
};

export default percent;
