import meta from "./meta.js";
import inspect from "./chapters/chapter1_inspection/index.js";
import construct from "./chapters/chapter2_construction/index.js";
import activate, { bindActions } from "./chapters/chapter3_activation/index.js";

export const buildSpecElement = (inArgs) => {
    inspect(inArgs);
    const element = construct(inArgs);
    const targetHtmlId = inArgs?.targetHtmlId ?? inArgs?.domIdToPushTo ?? inArgs?.inDomIdToPushTo;
    return activate({ element, targetHtmlId });
};

export const specToDom = buildSpecElement;

export {
    meta,
    bindActions
};

export default buildSpecElement;
