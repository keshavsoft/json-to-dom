import isEventAllowed from "../1.validate/isEventAllowed.js";

export const attachDeclaredEvents = ({ inElement, inEvents, inTagName, inShowLog = false }) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName?.toLowerCase();
    const localShowLog = inShowLog;

    if (!localElement || !localEvents || typeof localEvents !== "object") {
        return localElement;
    }

    Object.entries(localEvents).forEach(([eventName, listener]) => {
        if (typeof listener !== "function") return;

        if (isEventAllowed({ inTagName: localTagName, inEventName: eventName })) {
            localElement.addEventListener(eventName, listener);
        } else if (localShowLog) {
            console.warn(`[json-to-dom v10] Event "${eventName}" is not permitted on <${localTagName}>; discarded.`);
        }
    });

    return localElement;
};

export default attachDeclaredEvents;
