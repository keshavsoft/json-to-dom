import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

export const dispatchSpec = ({ inSpec, inShowLog = false, inOutput } = {}) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;
    const localOutput = inOutput;

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;

    if (isSpecArray({ inSpec: localSpec })) {
        return buildSpecArray({
            inSpec: localSpec, inShowLog: localShowLog,
            inOutput: localOutput
        });
    };

    if (!isSpecObject({ inSpec: localSpec })) return null;
    console.log("11111 :", localOutput);
    return buildSingleElement({
        inSpec: localSpec, inShowLog: localShowLog,
        inOutput: localOutput
    });
};

export {
    buildSingleElement,
    buildSpecArray
};

export default dispatchSpec;
