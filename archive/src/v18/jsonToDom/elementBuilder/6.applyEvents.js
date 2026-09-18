import { applyEvents as defaultApplyEvents } from "../events/index.js";

/**
 * 6. applyEvents - Element Builder Step 6
 * Attaches spec-declared event listeners (if provided in spec.events).
 * json-to-dom v18 does not inject internal component/interaction hooks.
 */
export const applyEvents = ({ inElement, inSpec, inApplyEvents = true, inShowLog = false } = {}) => {
    const localElement = inElement;
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!localElement || !localSpec || !localApplyEvents || !localSpec.events) return localElement;

    const eventHandler = typeof localApplyEvents === "function"
        ? localApplyEvents
        : defaultApplyEvents;

    eventHandler({
        inElement: localElement,
        inEvents: localSpec.events,
        inTagName: localSpec.tagName,
        inShowLog: localShowLog
    });

    return localElement;
};

export default applyEvents;
