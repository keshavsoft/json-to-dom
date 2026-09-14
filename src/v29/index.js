import meta from "./meta.js";
import inspect, { validate, validateSpec, standards, data } from "./chapters/chapter1_inspection/index.js";
import construct, { elementBuilder } from "./chapters/chapter2_construction/index.js";
import activate, { listeners, bindActions, formOperations, mountToContainer } from "./chapters/chapter3_activation/index.js";

export const buildSpecElement = (inArgs) => {
    inspect(inArgs);
    const element = construct(inArgs);
    const outputType = inArgs?.outputType ?? inArgs?.inOutputType ?? "dom";
    const targetHtmlId = inArgs?.targetHtmlId ?? inArgs?.domIdToPushTo ?? inArgs?.inDomIdToPushTo;
    return activate({ element, outputType, targetHtmlId });
};

export const specToDom = (inArgs = {}) => buildSpecElement({ ...inArgs, outputType: "dom" });
export const specToHtml = (inArgs = {}) => buildSpecElement({ ...inArgs, outputType: "html" });

export const jsonToDom = buildSpecElement;
jsonToDom.buildSpecElement = buildSpecElement;
jsonToDom.specToDom = specToDom;
jsonToDom.specToHtml = specToHtml;
jsonToDom.core = elementBuilder;

export const tree = { meta, jsonToDom, core: elementBuilder, validate, data, listeners };

export {
    meta,
    inspect,
    construct,
    activate,
    validate,
    validateSpec,
    standards,
    data,
    elementBuilder,
    listeners,
    bindActions,
    formOperations,
    mountToContainer
};

export default buildSpecElement;
