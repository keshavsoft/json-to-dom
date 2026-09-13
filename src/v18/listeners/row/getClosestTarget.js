export const getClosestTarget = ({ inTargetElement }) => {
    const localTargetElement = inTargetElement;
    if (!localTargetElement) return null;

    const dataset = localTargetElement.dataset;
    const closestTarget = dataset?.closestTarget;
    if (!closestTarget) return null;

    // Support CSS selector syntax or default to class lookup
    const selector = closestTarget.startsWith(".") || closestTarget.startsWith("#") || closestTarget.startsWith("[")
        ? closestTarget
        : `.${closestTarget}`;

    return localTargetElement.closest(selector);
};

export default getClosestTarget;
