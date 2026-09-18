import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
// import buildSingleElement from "./buildSingleElement.js";
import buildSingleElement from "./forSpec/v3/index.js";
import forArray from "./forArray/v1/index.js";

const dispatchSpec = ({ inSpecJson, inShowLog = false, inDataJson } = {}) => {
    // debugger
    if (isNullOrUndefined({ inSpec: inSpecJson })) return null;
    if (isDomNode({ inSpec: inSpecJson })) return inSpecJson;
    // debugger
    if (isSpecArray({ inSpecJson })) {
        return buildSpecArray({
            inArray: inSpecJson, inShowLog, inDataJson
        });
    };

    if ("jsonToSpec" in inSpecJson) {
        const fromArray = forArray({
            inTemplate: inSpecJson.jsonToSpec.template,
            inDataAsArray: inDataJson[inSpecJson.jsonToSpec.source]
        });

        inSpecJson.children = fromArray;
    };

    return buildSingleElement({
        inSpecJson, inShowLog, inData: inDataJson
    });
};

export default dispatchSpec;
