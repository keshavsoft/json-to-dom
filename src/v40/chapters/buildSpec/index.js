import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

const dispatchSpec = ({ inSpec, inShowLog = false } = {}) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;

    if (isSpecArray({ inSpec: localSpec })) {
        return buildSpecArray({
            inSpec: localSpec,
            inShowLog: localShowLog
        });
    }

    return buildSingleElement({
        inSpec: localSpec,
        inShowLog: localShowLog
    });
};

export default dispatchSpec;

