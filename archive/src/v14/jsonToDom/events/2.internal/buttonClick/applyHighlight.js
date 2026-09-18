export const applyHighlight = ({ inTargetElement, inClosestElement }) => {
    const localTargetElement = inTargetElement;
    const localClosestElement = inClosestElement;

    if (!localTargetElement || !localClosestElement) return;

    const dataset = localTargetElement.dataset;
    if (dataset?.highlight === "true" && dataset?.highlightClass) {
        const classes = dataset.highlightClass.split(" ").filter(Boolean);
        if (classes.length > 0) {
            localClosestElement.classList.add(...classes);
        }
    }
};

export default applyHighlight;
