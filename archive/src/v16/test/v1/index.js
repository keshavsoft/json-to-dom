import buildSpecElement, {
    meta,
    jsonToDom,
    buildSpecElementWithEvents,
    specToDom,
    applyEvents,
    getHookedEvents,
    validate,
    data
} from "../../index.js";

export const tree = {
    meta,
    jsonToDom,
    core: jsonToDom.core,
    events: jsonToDom.events,
    validate,
    data
};

export {
    meta,
    jsonToDom,
    buildSpecElement,
    buildSpecElementWithEvents,
    specToDom,
    applyEvents,
    getHookedEvents,
    validate,
    data
};

export default buildSpecElement;
