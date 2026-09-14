import dispatchSpec, { buildSingleElement, buildSpecArray } from "./buildSpec/index.js";
import elementBuilder from "./elementBuilder/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export const construct = (inArgs) => {
    const isConfig = inArgs && typeof inArgs === "object" 
        && !Array.isArray(inArgs) 
        && !(typeof Node !== "undefined" && inArgs instanceof Node) 
        && ("spec" in inArgs || "inSpec" in inArgs);

    const rawSpec = isConfig ? (inArgs.spec ?? inArgs.inSpec) : inArgs;
    const showLog = isConfig ? Boolean(inArgs.showLog ?? inArgs.inShowLog) : false;

    const { spec } = normalizeInput({ inSpec: rawSpec, inShowLog: showLog });
    return dispatchSpec({ inSpec: spec, inShowLog: showLog });
};

export {
    dispatchSpec,
    elementBuilder,
    normalizeInput,
    buildSingleElement,
    buildSpecArray
};

export default construct;
