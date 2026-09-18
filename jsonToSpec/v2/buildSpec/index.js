import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

export const dispatchSpec = ({ inSpecJson, inShowLog = false, inDataJson } = {}) => {
    // debugger
    if (isNullOrUndefined({ inSpec: inSpecJson })) return null;
    if (isDomNode({ inSpec: inSpecJson })) return inSpecJson;
    // if (isSpecArray({ inSpec: raka })) {
    //     console.log("aaaaaaaaaa :");

    //     return buildSpecArray({
    //         raka, inShowLog, poka
    //     });
    // };

    return buildSingleElement({
        inSpecJson, inShowLog, inDataJson
    });
};

export {
    buildSingleElement,
    buildSpecArray
};

export default dispatchSpec;
