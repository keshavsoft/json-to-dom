import isNullOrUndefined from "./buildSpec/isNullOrUndefined.js";
import isDomNode from "./buildSpec/isDomNode.js";
import isSpecArray from "./buildSpec/isSpecArray.js";
import isSpecObject from "./buildSpec/isSpecObject.js";
import buildSpecArray from "./buildSpec/buildSpecArray.js";
import buildSingleElement from "./buildSpec/buildSingleElement.js";
import tags from "../../docs/tags/tags.json" with { type: "json" };
import globalAllowedAttributes from "../../docs/tags/globalAllowedAttributes.json" with { type: "json" };
import allowedEvents from "../../docs/tags/allowedEvents.json" with { type: "json" };

import validateTag from "./validate/validateTag.js";
import validateSpec from "./validate/validateSpec.js";
import isAttributeAllowed from "./validate/isAttributeAllowed.js";
import isEventAllowed from "./validate/isEventAllowed.js";
import applyEvents from "./events/index.js";

const version = "v10.0";

/**
 * Core Declarative DOM Builder (v10)
 * Builds pure DOM trees with events optional and decoupled.
 */
export const buildSpecElement = (inArgs) => {
    let localSpec = inArgs;
    let localApplyEvents = false;
    let localShowLog = false;

    if (inArgs && typeof inArgs === "object" && !Array.isArray(inArgs) && !(typeof Node !== "undefined" && inArgs instanceof Node)) {
        if ("inSpec" in inArgs) {
            localSpec = inArgs.inSpec;
            localApplyEvents = Boolean(inArgs.inApplyEvents);
            localShowLog = Boolean(inArgs.inShowLog);
        }
    }

    if (typeof globalThis !== "undefined" && globalThis?.ks?.showLog) {
        localShowLog = true;
    }

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;
    if (isSpecArray({ inSpec: localSpec })) {
        return buildSpecArray({ inSpec: localSpec, inApplyEvents: localApplyEvents, inShowLog: localShowLog });
    }
    if (!isSpecObject({ inSpec: localSpec })) return null;

    return buildSingleElement({ inSpec: localSpec, inApplyEvents: localApplyEvents, inShowLog: localShowLog });
};

/**
 * Convenience builder with events enabled by default
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
    applyEvents
};

// Safe environment global registration
if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};
    globalThis.ks["json-to-dom"] = {
        version,
        buildSpecElement,
        buildSpecElementWithEvents,
        applyEvents,
        tags,
        globalAllowedAttributes,
        allowedEvents,
        validateTag,
        validateSpec,
        isAttributeAllowed,
        isEventAllowed
    };
}

export default buildSpecElement;
