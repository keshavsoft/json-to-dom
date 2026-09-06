export const applyClassList = ({ inElement, inClassList }) => {
    const localElement = inElement;
    const localClassList = inClassList;
    if (localClassList) {
        localElement.classList.add(...localClassList.split(/\s+/).filter(Boolean));
    }
    return localElement;
};

export default applyClassList;
