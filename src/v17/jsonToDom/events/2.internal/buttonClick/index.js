import getClosestTarget from "./getClosestTarget.js";
import applyHighlight from "./applyHighlight.js";
import extractOutput from "./extractOutput.js";

export const handleButtonClick = ({ inEvent }) => {
    const localEvent = inEvent;
    if (!localEvent) return;

    const currentTarget = localEvent.currentTarget;
    if (!currentTarget) return;

    // 1. Find closest target element based on data-closest-target
    const closestElement = getClosestTarget({ inTargetElement: currentTarget });

    // 2. Apply highlight classes if data-highlight="true"
    applyHighlight({
        inTargetElement: currentTarget,
        inClosestElement: closestElement
    });

    // 3. Extract output and attach to event.output
    localEvent.output = extractOutput({ inClosestElement: closestElement });
};

export default handleButtonClick;
