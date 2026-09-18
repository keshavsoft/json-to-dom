import handleButtonClick from "./buttonClick/index.js";

/**
 * 2. attachInternalEvents - Chapter 2
 * Attaches built-in component interaction hooks (e.g. <button> click handler that
 * resolves closest target and populates event.output).
 * 
 * Recorded on element.__ksEvents.internal for transparent runtime inspection.
 */
export const attachInternalEvents = ({ inElement, inTagName, inShowLog = false } = {}) => {
    const localElement = inElement;
    const localTagName = inTagName?.toLowerCase();
    const localShowLog = inShowLog;

    if (!localElement) return localElement;

    // Attach native button internal click hook
    if (localTagName === "button") {
        localElement.addEventListener("click", (event) => {
            handleButtonClick({ inEvent: event });
        });

        // Record hook in transparent registry on element
        localElement.__ksEvents ??= { internal: [], declared: [] };
        localElement.__ksEvents.internal.push("click");

        if (localShowLog) {
            console.log(`[json-to-dom v11] Hooked internal interaction on <${localTagName}>`, localElement);
        };
    }

    return localElement;
};

export default attachInternalEvents;
