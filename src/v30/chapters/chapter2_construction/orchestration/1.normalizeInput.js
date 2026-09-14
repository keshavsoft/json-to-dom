/**
 * 1. normalizeInput - Orchestration Step 1
 * Normalizes input arguments into a standardized configuration object:
 * { spec, showLog }
 */
export const normalizeInput = ({ inArgs, inSpec, inShowLog } = {}) => {
    const localArgs = inArgs;
    const localSpecInput = inSpec;
    const localShowLogInput = inShowLog;

    let localSpec = localSpecInput !== undefined ? localSpecInput : localArgs;
    let localShowLog = Boolean(localShowLogInput);

    if (localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && !(typeof Node !== "undefined" && localArgs instanceof Node)) {
        if ("inSpec" in localArgs) {
            localSpec = localArgs.inSpec;
            localShowLog = Boolean(localArgs.inShowLog);
        } else if ("spec" in localArgs) {
            localSpec = localArgs.spec;
            localShowLog = Boolean(localArgs.showLog);
        }
    }

    if (typeof globalThis !== "undefined" && globalThis?.ks?.showLog) {
        localShowLog = true;
    }

    return {
        spec: localSpec,
        showLog: localShowLog
    };
};

export default normalizeInput;
