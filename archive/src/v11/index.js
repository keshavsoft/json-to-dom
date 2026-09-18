import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./orchestration/2.dispatchSpec.js";
import registerGlobal from "./orchestration/3.registerGlobal.js";

import tags from "../../docs/tags/tags.json" with { type: "json" };
import globalAllowedAttributes from "../../docs/tags/globalAllowedAttributes.json" with { type: "json" };
import allowedEvents from "../../docs/tags/allowedEvents.json" with { type: "json" };

import validateTag from "./validate/validateTag.js";
import validateSpec from "./validate/validateSpec.js";
import isAttributeAllowed from "./validate/isAttributeAllowed.js";
import isEventAllowed from "./validate/isEventAllowed.js";
import applyEvents, { getHookedEvents } from "./events/index.js";

const version = "v11.0";

/**
 * Core Declarative DOM Builder (v11)
 * Sleek Orchestration Story:
 * Step 1: Normalize input arguments & configuration
 * Step 2: Dispatch to DOM builder pipeline
 */
export const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;

    // Step 1: Normalize input arguments & options
    const { spec, applyEvents: localApplyEvents, showLog } = normalizeInput({ inArgs: localArgs });
    // console.log("[index.js] localApplyEvents : ", localApplyEvents);

    // Step 2: Dispatch to DOM builder
    return dispatchSpec({
        inSpec: spec,
        inApplyEvents: localApplyEvents,
        inShowLog: showLog
    });
};

/**
 * Convenience orchestrator with events explicitly enabled
 */
export const buildSpecElementWithEvents = ({ inSpec, inShowLog = false } = {}) => {
    return buildSpecElement({
        inSpec,
        inApplyEvents: true,
        inShowLog
    });
};

export {
    version,
    tags,
    globalAllowedAttributes,
    allowedEvents,
    validateTag,
    validateSpec,
    isAttributeAllowed,
    isEventAllowed,
    applyEvents,
    getHookedEvents
};

// Step 3: Register API to global environment
registerGlobal({
    inApi: {
        version,
        buildSpecElement,
        buildSpecElementWithEvents,
        applyEvents,
        getHookedEvents,
        tags,
        globalAllowedAttributes,
        allowedEvents,
        validateTag,
        validateSpec,
        isAttributeAllowed,
        isEventAllowed
    }
});

export default buildSpecElement;
