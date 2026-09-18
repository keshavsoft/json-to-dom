import dispatchSpec, { buildSingleElement, buildSpecArray } from "./buildSpec/index.js";
import elementBuilder from "./elementBuilder/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export const construct = (inArgs) => {
    const localArgs = inArgs;
    const isConfig = localArgs && typeof localArgs === "object" 
        && !Array.isArray(localArgs) 
        && !(typeof Node !== "undefined" && localArgs instanceof Node) 
        && ("spec" in localArgs || "inSpec" in localArgs);

    const localRawSpec = isConfig ? (localArgs.spec ?? localArgs.inSpec) : localArgs;
    const localShowLog = isConfig ? Boolean(localArgs.showLog ?? localArgs.inShowLog) : false;

    const { spec } = normalizeInput({ inSpec: localRawSpec, inShowLog: localShowLog });
    return dispatchSpec({ inSpec: spec, inShowLog: localShowLog });
};

export {
    elementBuilder,
    buildSingleElement,
    buildSpecArray
};

export default construct;
