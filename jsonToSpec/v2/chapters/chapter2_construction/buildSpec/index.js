import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement.js";

export const dispatchSpec = ({ raka, inShowLog = false, poka } = {}) => {
    console.log("11111 :", raka, poka);

    if (isNullOrUndefined({ inSpec: raka })) return null;
    if (isDomNode({ inSpec: raka })) return raka;

    if (isSpecArray({ inSpec: raka })) {
        console.log("aaaaaaaaaa :");

        return buildSpecArray({
            raka, inShowLog, poka
        });
    };

    if (!isSpecObject({ inSpec: raka })) return null;

    return buildSingleElement({
        raka, inShowLog, poka
    });
};

export {
    buildSingleElement,
    buildSpecArray
};

export default dispatchSpec;
