import isEventAllowed from "../1.validate/isEventAllowed.js";

/**
 * 3. attachDeclaredEvents - Chapter 3
 * Validates spec-declared events against allowedEvents.json and binds them.
 * 
 * Recorded on element.__ksEvents.declared for transparent runtime inspection.
 */
export const attachDeclaredEvents = ({ inElement, inEvents, inTagName, inShowLog = false } = {}) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName?.toLowerCase();
    const localShowLog = inShowLog;

    if (!localElement || !localEvents || typeof localEvents !== "object") {
        return localElement;
    }

    localElement.__ksEvents ??= { internal: [], declared: [] };

    Object.entries(localEvents).forEach(([eventName, listener]) => {
        if (typeof listener !== "function") return;

        if (isEventAllowed({ inTagName: localTagName, inEventName: eventName })) {
            localElement.addEventListener(eventName, listener);
            localElement.__ksEvents.declared.push(eventName);

            if (localShowLog) {
                console.log(`[json-to-dom v11] Hooked declared event "${eventName}" on <${localTagName}>`, localElement);
            }
        } else if (localShowLog) {
            console.warn(`[json-to-dom v11] Event "${eventName}" is not permitted on <${localTagName}>; discarded.`);
        }
    });

    return localElement;
};

export default attachDeclaredEvents;
