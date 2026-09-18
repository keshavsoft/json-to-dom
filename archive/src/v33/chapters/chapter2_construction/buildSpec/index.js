import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

export const dispatchSpec = ({ inSpec, inShowLog = false, inOutputType } = {}) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;

    if (isSpecArray({ inSpec: localSpec })) {
        return buildSpecArray({
            inSpec: localSpec, inShowLog: localShowLog,
            inOutputType
        });
    };

    if (!isSpecObject({ inSpec: localSpec })) return null;

    return buildSingleElement({
        inSpec: localSpec, inShowLog: localShowLog,
        inOutputType
    });
};

export {
    buildSingleElement,
    buildSpecArray
};

export default dispatchSpec;
