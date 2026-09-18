import { isNullOrUndefined, isDomNode, isSpecArray, isSpecObject } from "./guards.js";
import buildSpecArray from "./buildSpecArray.js";
// import buildSingleElement from "./buildSingleElement.js";
import buildSingleElement from "./forSpec/v3/index.js";
import forArray from "./forArray/v1/index.js";
import forObject from "./forObject/v1/index.js";

const dispatchSpec = ({ inSpecJson, inShowLog = false, inDataJson } = {}) => {
    // debugger
    console.log("2222222--------loopObject : ", inDataJson);

    if (isNullOrUndefined({ inSpec: inSpecJson })) return null;
    if (isDomNode({ inSpec: inSpecJson })) return inSpecJson;
    // debugger
    if (isSpecArray({ inSpecJson })) {
        return buildSpecArray({
            inArray: inSpecJson, inShowLog, inDataJson
        });
    };

    if ("jsonToSpec" in inSpecJson) {
        if (inSpecJson.jsonToSpec.operation === "loopArray") {
            const fromArray = forArray({
                inTemplate: inSpecJson.jsonToSpec.template,
                inDataAsArray: inDataJson[inSpecJson.jsonToSpec.source]
            });

            inSpecJson.children = fromArray;
        };

        if (inSpecJson.jsonToSpec.operation === "loopObject") {
            console.log("---------loopObject : ", inDataJson);

            const fromObject = forObject({
                inTemplate: inSpecJson.jsonToSpec.template,
                inDataAsObject: inDataJson
            });

            inSpecJson.children = fromObject;
        };
    };

    return buildSingleElement({
        inSpecJson, inShowLog, inData: inDataJson
    });
};

export default dispatchSpec;
