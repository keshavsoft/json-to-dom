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
export const dispatchSpec = ({ inSpec, inApplyEvents = true, inShowLog = false } = {}) => {
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;

    if (isSpecArray({ inSpec: localSpec })) {
        return buildSpecArray({ inSpec: localSpec, inApplyEvents: localApplyEvents, inShowLog: localShowLog });
    };

    if (!isSpecObject({ inSpec: localSpec })) return null;
    // console.log("localApplyEvents : ", localApplyEvents);

    return buildSingleElement({ inSpec: localSpec, inApplyEvents: localApplyEvents, inShowLog: localShowLog });
};

export default dispatchSpec;
