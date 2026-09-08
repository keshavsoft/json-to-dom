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

const version = "v9.1";

export const buildSpecElement = (inSpec) => {
    const localSpec = (inSpec && typeof inSpec === "object" && "inSpec" in inSpec && !(inSpec instanceof Node) && !Array.isArray(inSpec))
        ? inSpec.inSpec
        : inSpec;

    const localShowLog = Boolean(window?.ks?.showLog);

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;
    if (isSpecArray({ inSpec: localSpec })) return buildSpecArray({ inSpec: localSpec });
    if (!isSpecObject({ inSpec: localSpec })) return null;

    return buildSingleElement({ inSpec: localSpec, inShowLog: localShowLog });
};

export { version, tags, globalAllowedAttributes, allowedEvents, validateTag, validateSpec, isAttributeAllowed, isEventAllowed };

window.ks ??= {};

window.ks.showLog = true;

window.ks["json-to-dom"] = {
    version,
    buildSpecElement,
    tags,
    globalAllowedAttributes,
    allowedEvents,
    validateTag,
    validateSpec,
    isAttributeAllowed,
    isEventAllowed
};

export default buildSpecElement;
