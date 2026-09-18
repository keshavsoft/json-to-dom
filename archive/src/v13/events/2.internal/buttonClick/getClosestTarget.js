export const getClosestTarget = ({ inTargetElement }) => {
    const localTargetElement = inTargetElement;
    if (!localTargetElement) return null;

    const dataset = localTargetElement.dataset;
    const closestTargetClass = dataset?.closestTarget;
    if (!closestTargetClass) return null;

    return localTargetElement.closest(`.${closestTargetClass}`);
};

export default getClosestTarget;
