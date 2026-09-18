import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./orchestration/2.dispatchSpec.js";

import meta from "../meta.js";
import applyEvents, { getHookedEvents } from "./events/index.js";
import validate from "./validate/index.js";
import data from "./data/index.js";
import blues from "./blues.js";

const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;
    const { spec, applyEvents: localApplyEvents, showLog } = normalizeInput({ inArgs: localArgs });
    return dispatchSpec({ inSpec: spec, inApplyEvents: localApplyEvents, inShowLog: showLog });
};

const specToDom = ({
    spec, domIdToPushTo,
    showLog = false
}) => {
    const domSpecAsJson = dispatchSpec({ inSpec: spec, inShowLog: showLog });

    const container = document.getElementById(domIdToPushTo);
    const domElement = buildSpecElement({ inSpec: domSpecAsJson });

    if (Array.isArray(domElement)) {
        container.append(...domElement);
    } else if (domElement) {
        container.appendChild(domElement);
    }
};

const buildSpecElementWithEvents = ({ inSpec, inShowLog = false } = {}) => {
    return buildSpecElement({ inSpec, inApplyEvents: true, inShowLog });
};

export const jsonToDom = {
    meta,
    core: { buildSpecElement, buildSpecElementWithEvents, specToDom },
    events: { applyEvents, getHookedEvents },
    validate,
    data,
    blues
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
    data,
    blues
};

export default buildSpecElement;
