import isNullOrUndefined from "../buildSpec/isNullOrUndefined.js";
import isDomNode from "../buildSpec/isDomNode.js";
import isSpecArray from "../buildSpec/isSpecArray.js";
import isSpecObject from "../buildSpec/isSpecObject.js";
import buildSpecArray from "../buildSpec/buildSpecArray.js";
import buildSingleElement from "../buildSpec/buildSingleElement.js";

/**
 * 2. dispatchSpec - Orchestration Step 2
 * Dispatches the normalized spec to the appropriate builder:
 * - null / undefined -> null
 * - Existing DOM Node -> passthrough
 * - Array of specs -> DocumentFragment
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

export default dispatchSpec;
