import isEventAllowed from "./1.validate/isEventAllowed.js";
import isControlWithEvents from "./1.validate/isControlWithEvents.js";
import attachDeclaredEvents from "./3.declared/attachDeclaredEvents.js";
import getHookedEvents from "./getHookedEvents.js";

/**
 * applyEvents - Coordinates spec-declared event listeners.
 * json-to-dom v18 is a pure DOM renderer and does not inject internal component/interaction hooks.
 */
export const applyEvents = ({
    inElement,
    inEvents,
    inTagName,
    inShowLog = false
} = {}) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    if (!localElement || !localTagName || !localEvents || typeof localEvents !== "object") {
        return localElement;
    }

    attachDeclaredEvents({
        inElement: localElement,
        inEvents: localEvents,
        inTagName: localTagName,
        inShowLog: localShowLog
    });

    return localElement;
};

export {
    isEventAllowed,
    isControlWithEvents,
    attachDeclaredEvents,
    getHookedEvents
};

export default applyEvents;
