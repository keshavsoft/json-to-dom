import registerGlobal from "./register/index.js";
import jsonToTag from "@keshavsoft/json-to-tag";
import specToDom from "spec-to-dom";

const startFunc = ({ jsonSpec, targetHtmlId, appendPosition, showLog }) => {

    const buildSpec = jsonToTag(jsonSpec);

    const container = specToDom({ buildSpec, targetHtmlId, appendPosition, showLog });

    return container;
};

registerGlobal(startFunc);

export default startFunc;