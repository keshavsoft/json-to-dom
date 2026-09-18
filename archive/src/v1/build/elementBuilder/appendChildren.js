export const appendChildren = ({ inElement, inChildren }) => {
    const localElement = inElement;
    const localChildren = inChildren;
    if (Array.isArray(localChildren)) {
        localChildren.forEach(child => {
            if (child instanceof Node) {
                localElement.appendChild(child);
            }
        });
    }
    return localElement;
};

export default appendChildren;
