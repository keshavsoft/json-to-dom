import dispatchSpec from "./buildSpec/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export const construct = (inArgs) => {
    const localArgs = inArgs;
    const isConfig = localArgs && typeof localArgs === "object"
        && !Array.isArray(localArgs)
        && !(typeof Node !== "undefined" && localArgs instanceof Node)
        && ("spec" in localArgs || "inSpec" in localArgs);

    const localRawSpec = isConfig ? (localArgs.spec ?? localArgs.inSpec) : localArgs;
    const localShowLog = isConfig ? Boolean(localArgs.showLog ?? localArgs.inShowLog) : false;
    console.log("1 : ", localRawSpec);

    const { spec } = normalizeInput({ inSpec: localRawSpec, inShowLog: localShowLog });
    console.log("2 : ", spec);
    return dispatchSpec({ inSpec: spec, inShowLog: localShowLog });
};

export default construct;
