import isEventAllowed from "./1.validate/isEventAllowed.js";
import isControlWithEvents from "./1.validate/isControlWithEvents.js";
import attachInternalEvents from "./2.internal/attachInternalEvents.js";
import handleButtonClick from "./2.internal/buttonClick/index.js";
import attachDeclaredEvents from "./3.declared/attachDeclaredEvents.js";

/**
 * applyEvents - Coordinates the entire event lifecycle as a 3-stage story:
 * 1. Validate permissions
 * 2. Attach internal control hooks (e.g. button interactions)
 * 3. Attach validated spec-declared event listeners
 */
export const applyEvents = ({
    inElement,
    inEvents,
    inTagName,
    inAttachInternal = true,
    inShowLog = false
} = {}) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName;
    const localAttachInternal = inAttachInternal;
    const localShowLog = inShowLog;

    if (!localElement || !localTagName) return localElement;

    // Stage 1: Attach internal component interaction hooks (optional / toggleable)
    if (localAttachInternal) {
        attachInternalEvents({
            inElement: localElement,
            inTagName: localTagName
        });
    }

    // Stage 2: Attach validated user-declared event listeners
    if (localEvents && typeof localEvents === "object") {
        attachDeclaredEvents({
            inElement: localElement,
            inEvents: localEvents,
            inTagName: localTagName,
            inShowLog: localShowLog
        });
    }

    return localElement;
};

export {
    isEventAllowed,
    isControlWithEvents,
    attachInternalEvents,
    attachDeclaredEvents,
    handleButtonClick
};

export default applyEvents;
