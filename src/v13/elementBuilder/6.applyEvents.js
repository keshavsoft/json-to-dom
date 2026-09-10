import { applyEvents as defaultApplyEvents } from "../events/index.js";

/**
 * 6. applyEvents - Element Builder Step 6
 * Optional & Configurable Event Hooking Stage
 * 
 * How to stop hooking:
 * - Pass inApplyEvents: false (stops all events)
 * - Pass inApplyEvents: { internal: false } or inAttachInternal: false (stops internal hooks only)
 * - Pass inApplyEvents: { declared: false } (stops declared spec events only)
 * - In spec: attachInternal: false (stops internal hook on this specific element)
 * 
 * Where to inspect:
 * - element.__ksEvents records { internal: [...], declared: [...] }
 */
export const applyEvents = ({ inElement, inSpec, inApplyEvents = true, inShowLog = false } = {}) => {
    const localElement = inElement;
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!localElement || !localSpec || !localApplyEvents) return localElement;

    const eventHandler = typeof localApplyEvents === "function"
        ? localApplyEvents
        : defaultApplyEvents;

    const isInternalEnabled = typeof localApplyEvents === "object"
        ? localApplyEvents.internal !== false
        : Boolean(localApplyEvents);

    const isDeclaredEnabled = typeof localApplyEvents === "object"
        ? localApplyEvents.declared !== false
        : Boolean(localApplyEvents);

    eventHandler({
        inElement: localElement,
        inEvents: isDeclaredEnabled ? localSpec.events : null,
        inTagName: localSpec.tagName,
        inAttachInternal: isInternalEnabled && localSpec.attachInternal !== false,
        inAttachDeclared: isDeclaredEnabled,
        inShowLog: localShowLog
    });

    return localElement;
};

export default applyEvents;
