import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

export const dispatchSpec = ({ inSpecJson, inShowLog = false, inDataJson } = {}) => {
    // debugger
    if (isNullOrUndefined({ inSpec: inSpecJson })) return null;
    if (isDomNode({ inSpec: inSpecJson })) return inSpecJson;
    // debugger
    if (isSpecArray({ inSpecJson })) {
        return buildSpecArray({
            inArray: inSpecJson, inShowLog, inDataJson
        });
    };

    return buildSingleElement({
        inSpecJson, inShowLog, inDataJson
    });
};

export default dispatchSpec;
