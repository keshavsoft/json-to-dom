import isEventAllowed from "./1.validate/isEventAllowed.js";
import isControlWithEvents from "./1.validate/isControlWithEvents.js";
import attachInternalEvents from "./2.internal/attachInternalEvents.js";
import handleButtonClick from "./2.internal/buttonClick/index.js";
import attachDeclaredEvents from "./3.declared/attachDeclaredEvents.js";
import getHookedEvents from "./getHookedEvents.js";

/**
 * applyEvents - Coordinates the entire event lifecycle as a 3-stage story:
 * 1. Validate permissions
 * 2. Attach internal control hooks (e.g. button interactions)
 * 3. Attach validated spec-declared event listeners
 * 
 * Where to stop hooking:
 * - inAttachInternal: false -> stops Stage 1 (internal button hooks)
 * - inAttachDeclared: false -> stops Stage 2 (declared spec listeners)
 * 
 * Where to see what is hooked:
 * - element.__ksEvents or getHookedEvents({ inElement })
 */
export const applyEvents = ({
    inElement,
    inEvents,
    inTagName,
    inAttachInternal = true,
    inAttachDeclared = true,
    inShowLog = false
} = {}) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName;
    const localAttachInternal = inAttachInternal;
    const localAttachDeclared = inAttachDeclared;
    const localShowLog = inShowLog;

    if (!localElement || !localTagName) return localElement;

    // Stage 1: Attach internal component interaction hooks (optional / toggleable)
    if (localAttachInternal) {
        attachInternalEvents({
            inElement: localElement,
            inTagName: localTagName,
            inShowLog: localShowLog
        });
    }

    // Stage 2: Attach validated user-declared event listeners
    if (localAttachDeclared && localEvents && typeof localEvents === "object") {
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
    handleButtonClick,
    getHookedEvents
};

export default applyEvents;
