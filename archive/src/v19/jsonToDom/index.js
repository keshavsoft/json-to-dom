import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./orchestration/2.dispatchSpec.js";

import meta from "../meta.js";
import applyEvents, { getHookedEvents } from "./events/index.js";
import validate from "./validate/index.js";
import data from "./data/index.js";

const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;

    // Supports both standard config object { inSpec, inShowLog } and raw spec input
    const isConfigObject = localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && !(typeof Node !== "undefined" && localArgs instanceof Node) && ("inSpec" in localArgs || "spec" in localArgs);

    const localSpec = isConfigObject ? (localArgs.inSpec ?? localArgs.spec) : localArgs;
    const localShowLog = isConfigObject ? Boolean(localArgs.inShowLog ?? localArgs.showLog) : false;

    const { spec, showLog } = normalizeInput({ inSpec: localSpec, inShowLog: localShowLog });

    return dispatchSpec({ inSpec: spec, inShowLog: showLog });
};

const specToDom = ({
    inSpec,
    inDomIdToPushTo,
    inShowLog = false,
    spec,
    domIdToPushTo,
    showLog = false
} = {}) => {
    const localSpec = inSpec !== undefined ? inSpec : spec;
    const localDomIdToPushTo = inDomIdToPushTo !== undefined ? inDomIdToPushTo : domIdToPushTo;
    const localShowLog = inShowLog || showLog || false;

    const container = typeof document !== "undefined" && localDomIdToPushTo
        ? document.getElementById(localDomIdToPushTo)
        : null;

    const domElement = buildSpecElement({ inSpec: localSpec, inShowLog: localShowLog });

    if (container && domElement) {
        if (Array.isArray(domElement)) {
            container.append(...domElement);
        } else {
            container.appendChild(domElement);
        }
    }

    return domElement;
};

const buildSpecElementWithEvents = ({ inSpec, inShowLog = false } = {}) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;
    return buildSpecElement({ inSpec: localSpec, inShowLog: localShowLog });
};

export const jsonToDom = {
    meta,
    core: { buildSpecElement, buildSpecElementWithEvents, specToDom },
    events: { applyEvents, getHookedEvents },
    validate,
    data
};

export {
    normalizeInput,
    dispatchSpec,
    buildSpecElement,
    buildSpecElementWithEvents,
    specToDom,
    applyEvents,
    getHookedEvents,
    validate,
    data
};

export default buildSpecElement;
