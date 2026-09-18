import getClosestTarget from "./getClosestTarget.js";
import applyHighlight from "./applyHighlight.js";
import extractOutput from "./extractOutput.js";

/**
 * attachRowListener - Container-Level Event Delegation
 * Attaches a single event listener on the parent container to handle interactions
 * for any button with `data-closest-target`.
 */
export const attachRowListener = ({
    inContainer,
    inContainerId,
    inOnClick,
    inShowLog = false
} = {}) => {
    const localContainer = inContainer || (inContainerId ? document.getElementById(inContainerId) : null);
    const localOnClick = inOnClick;
    const localShowLog = inShowLog;

    if (!localContainer) {
        if (localShowLog) {
            console.warn("[json-to-dom listeners] attachRowListener: Container not found.");
        }
        return null;
    }

    const clickHandler = (event) => {
        const button = event.target.closest("button[data-closest-target]");
        if (!button) return;

        const closestElement = getClosestTarget({ inTargetElement: button });
        if (!closestElement) return;

        // Apply highlight with container-level radio behavior
        applyHighlight({
            inTargetElement: button,
            inClosestElement: closestElement,
            inContainerElement: localContainer
        });

        // Extract output from target container
        const output = extractOutput({ inClosestElement: closestElement });
        event.output = output;

        if (localShowLog) {
            console.log("[json-to-dom listeners] Row interaction triggered:", {
                button,
                closestElement,
                output
            });
        }

        if (typeof localOnClick === "function") {
            localOnClick({
                inOutput: output,
                inButton: button,
                inClosestElement: closestElement,
                inEvent: event
            });
        }
    };

    localContainer.addEventListener("click", clickHandler);

    return {
        remove: () => {
            localContainer.removeEventListener("click", clickHandler);
        }
    };
};

export default attachRowListener;
