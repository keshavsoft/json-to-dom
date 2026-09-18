import { applyEvents as defaultApplyEvents } from "../events/index.js";

/**
 * 6. applyEvents - Element Builder Step 6
 * Attaches spec-declared event listeners (if provided in spec.events).
 */
export const applyEvents = ({ inElement, inSpec, inShowLog = false } = {}) => {
    const localElement = inElement;
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (!localElement || !localSpec?.events) return localElement;

    defaultApplyEvents({
        inElement: localElement,
        inEvents: localSpec.events,
        inTagName: localSpec.tagName,
        inShowLog: localShowLog
    });

    return localElement;
};

export default applyEvents;
