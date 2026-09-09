/**
 * 1. normalizeInput - Orchestration Step 1
 * Normalizes user input arguments into a standardized configuration object:
 * { spec, applyEvents, showLog }
 * 
 * Event Hooking Control:
 * - inApplyEvents: false                    -> Stops all event hooking
 * - inApplyEvents: { internal: false }       -> Stops internal button hooking only
 * - inApplyEvents: { declared: false }       -> Stops declared spec events only
 * - inAttachInternal: false                  -> Convenience flag to stop internal hooks
 */
export const normalizeInput = ({ inArgs } = {}) => {
    const localArgs = inArgs;

    let localSpec = localArgs;
    let localApplyEvents = true;
    let localShowLog = false;

    if (localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && !(typeof Node !== "undefined" && localArgs instanceof Node)) {
        if ("inSpec" in localArgs) {
            localSpec = localArgs.inSpec;
            localShowLog = Boolean(localArgs.inShowLog);

            if (localArgs.inApplyEvents === false) {
                localApplyEvents = false;
            } else if (typeof localArgs.inApplyEvents === "object" && localArgs.inApplyEvents !== null) {
                localApplyEvents = {
                    internal: localArgs.inApplyEvents.internal !== false,
                    declared: localArgs.inApplyEvents.declared !== false
                };
            } else {
                localApplyEvents = true;
            }

            // Convenience shortcut: inAttachInternal: false
            if (localArgs.inAttachInternal === false) {
                localApplyEvents = typeof localApplyEvents === "object"
                    ? { ...localApplyEvents, internal: false }
                    : { internal: false, declared: true };
            }
        }
    }

    if (typeof globalThis !== "undefined" && globalThis?.ks?.showLog) {
        localShowLog = true;
    }

    return {
        spec: localSpec,
        applyEvents: localApplyEvents,
        showLog: localShowLog
    };
};

export default normalizeInput;
