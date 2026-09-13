import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./orchestration/2.dispatchSpec.js";

import meta from "../meta.js";
import applyEvents, { getHookedEvents } from "./events/index.js";
import validate from "./validate/index.js";
import data from "./data/index.js";

const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;

    const { spec, applyEvents: localApplyEvents, showLog } = normalizeInput({ inArgs: localArgs });

    return dispatchSpec({ inSpec: spec, inApplyEvents: localApplyEvents, inShowLog: showLog });
};

const specToDom = ({
    spec,
    domIdToPushTo,
    showLog = false
} = {}) => {
    const localSpec = spec;
    const localDomIdToPushTo = domIdToPushTo;
    const localShowLog = showLog;

    const domSpecAsJson = dispatchSpec({ inSpec: localSpec, inShowLog: localShowLog });

    const container = document.getElementById(localDomIdToPushTo);
    const domElement = buildSpecElement({ inSpec: domSpecAsJson });

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
    return buildSpecElement({ inSpec: localSpec, inApplyEvents: true, inShowLog: localShowLog });
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
