import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

const dispatchSpec = ({ inSpec, inShowLog = false } = {}) => {
    if (isNullOrUndefined({ inSpec })) return null;
    if (isDomNode({ inSpec })) return raka;

    if (isSpecArray({ inSpec })) {
        return buildSpecArray({
            raka, inShowLog
        });
    };
    // debugger
    return buildSingleElement({
        inSpec, inShowLog
    });
};

export default dispatchSpec;
