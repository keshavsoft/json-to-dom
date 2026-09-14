/**
 * applyHighlight - Applies visual highlight to the targeted element/row
 * Removes any previous highlight from siblings in the container for clean visual feedback.
 */
export const applyHighlight = ({ inTargetElement, inClosestElement, inContainerElement }) => {
    const localTarget = inTargetElement;
    const localClosest = inClosestElement;
    const localContainer = inContainerElement;

    if (!localTarget || !localClosest) return;

    const highlightEnabled = localTarget.dataset?.highlight === "true";
    if (!highlightEnabled) return;

    const highlightClasses = localTarget.dataset?.highlightClass
        ? localTarget.dataset.highlightClass.split(/\s+/).filter(Boolean)
        : ["bg-primary-subtle", "border", "border-primary"];

    // Clean up highlights from siblings in this container
    if (localContainer && typeof localContainer.querySelectorAll === "function") {
        const targetSelector = localTarget.dataset?.closestTarget
            ? `.${localTarget.dataset.closestTarget}`
            : ".ksrow";

        const allButtons = localContainer.querySelectorAll("button[data-highlight-class]");
        const allClassesToRemove = new Set(highlightClasses);
        allButtons.forEach(btn => {
            if (btn.dataset?.highlightClass) {
                btn.dataset.highlightClass.split(/\s+/).filter(Boolean).forEach(c => allClassesToRemove.add(c));
            }
        });

        const siblings = localContainer.querySelectorAll(targetSelector);
        siblings.forEach((sibling) => {
            if (sibling !== localClosest) {
                sibling.classList.remove(...allClassesToRemove);
            }
        });
    }

    // Apply highlight classes to the active element
    localClosest.classList.add(...highlightClasses);
};

export default applyHighlight;
