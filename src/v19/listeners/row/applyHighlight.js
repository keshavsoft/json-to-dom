export const applyHighlight = ({ inTargetElement, inClosestElement, inContainerElement }) => {
    const localTargetElement = inTargetElement;
    const localClosestElement = inClosestElement;
    const localContainerElement = inContainerElement;

    if (!localTargetElement || !localClosestElement) return;

    const dataset = localTargetElement.dataset;
    if (dataset?.highlight === "true" && dataset?.highlightClass) {
        const classes = dataset.highlightClass.split(" ").filter(Boolean);
        if (classes.length === 0) return;

        // Optionally clear previous highlights within container
        if (localContainerElement) {
            const firstClass = classes[0];
            const previousHighlighted = localContainerElement.querySelectorAll(`.${firstClass}`);
            previousHighlighted.forEach(el => {
                if (el !== localClosestElement) {
                    el.classList.remove(...classes);
                }
            });
        }

        localClosestElement.classList.add(...classes);
    }
};

export default applyHighlight;
