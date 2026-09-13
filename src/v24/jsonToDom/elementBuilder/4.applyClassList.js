export const applyClassList = ({ inElement, inClassList }) => {
    const localElement = inElement;
    const localClassList = inClassList;

    if (!localElement || !localClassList) return localElement;

    let classesToAdd = [];
    if (typeof localClassList === "string") {
        classesToAdd = localClassList.split(/\s+/).filter(Boolean);
    } else if (Array.isArray(localClassList)) {
        classesToAdd = localClassList.filter(c => typeof c === "string" && c.trim().length > 0);
    }

    if (classesToAdd.length > 0) {
        localElement.classList.add(...classesToAdd);
    }

    return localElement;
};

export default applyClassList;
