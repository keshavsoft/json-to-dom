import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

/**
 * dispatchSpec - Recursive Core Spec-to-DOM Dispatcher
 * Dispatches the spec to the appropriate builder:
 * - null / undefined -> null
 * - Existing DOM Node -> passthrough
 * - Array of specs -> Array of Elements
 * - Valid spec Object -> Single HTML Element
 */
export const dispatchSpec = ({ inSpec, inShowLog = false } = {}) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;

    if (isSpecArray({ inSpec: localSpec })) {
        return buildSpecArray({ inSpec: localSpec, inShowLog: localShowLog });
    }

    if (!isSpecObject({ inSpec: localSpec })) return null;

    return buildSingleElement({ inSpec: localSpec, inShowLog: localShowLog });
};

export {
    buildSingleElement,
    buildSpecArray
};

export default dispatchSpec;
