import extractInputs from "./extractInputs.js";
import applyHighlight from "./applyHighlight.js";

/**
 * bindActions - Container-Level Event Delegation by data-action
 * Clean public API (no 'in' prefix required):
 * { container, containerId, actions = {}, showLog = false }
 * Or internal convention:
 * { inContainer, inContainerId, inActions, inShowLog }
 */
export const bindActions = (inArgs = {}) => {
    const localArgs = inArgs;

    const localContainer = localArgs.container
        || localArgs.inContainer
        || (typeof document !== "undefined" && (localArgs.containerId || localArgs.inContainerId)
            ? document.getElementById(localArgs.containerId || localArgs.inContainerId)
            : null);

    const localActions = localArgs.actions || localArgs.inActions || {};
    const localShowLog = Boolean(localArgs.showLog ?? localArgs.inShowLog);

    if (!localContainer) {
        if (localShowLog) {
            console.warn("[json-to-dom listeners] bindActions: Container not found.");
        }
        return { remove: () => {} };
    }

    const clickHandler = (event) => {
        // Find closest button/element declaring an action
        const actionElement = event.target?.closest?.("[data-action]");
        if (!actionElement) return;

        const actionName = actionElement.dataset.action;
        const handler = localActions[actionName];

        // Find surrounding row/card context
        const targetClass = actionElement.dataset.closestTarget || "ksrow";
        const rowElement = actionElement.closest(`.${targetClass}`) || actionElement.parentElement;

        // Apply visual feedback if configured
        if (rowElement) {
            applyHighlight({
                inTargetElement: actionElement,
                inClosestElement: rowElement,
                inContainerElement: localContainer
            });
        }

        // Extract input values from the row context
        const values = rowElement ? extractInputs({ inElement: rowElement }) : {};

        if (localShowLog) {
            console.log(`[json-to-dom listeners] Action triggered: "${actionName}"`, {
                target: actionElement,
                row: rowElement,
                values
            });
        }

        // Execute action callback if registered
        if (typeof handler === "function") {
            handler({
                event,
                target: actionElement,
                row: rowElement,
                values,
                container: localContainer
            });
        } else if (localShowLog) {
            console.warn(`[json-to-dom listeners] No handler registered for action "${actionName}".`);
        }
    };

    localContainer.addEventListener("click", clickHandler);

    return {
        remove: () => {
            localContainer.removeEventListener("click", clickHandler);
        }
    };
};

export default bindActions;
