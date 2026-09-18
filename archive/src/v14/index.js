import meta from "./meta.js";
import buildSpecElement, {
    jsonToDom,
    buildSpecElementWithEvents,
    specToDom,
    applyEvents,
    getHookedEvents,
    validate,
    data,
    blues
} from "./jsonToDom/index.js";
import registerGlobal from "./jsonToDom/orchestration/3.registerGlobal.js";
import reverse, { domToSpec, getStartSpec } from "./Reverse/index.js";

export const tree = {
    meta,
    jsonToDom,
    reverse,
    core: jsonToDom.core,
    events: jsonToDom.events,
    validate,
    data
};

export {
    meta,
    jsonToDom,
    reverse,
    blues,
    buildSpecElement,
    buildSpecElementWithEvents,
    specToDom,
    domToSpec,
    getStartSpec,
    applyEvents,
    getHookedEvents,
    validate,
    data
};

registerGlobal({
    inApi: {
        ...tree,
        blues,
        buildSpecElement,
        buildSpecElementWithEvents,
        specToDom,
        domToSpec,
        getStartSpec,
        applyEvents,
        getHookedEvents
    }
});

export default buildSpecElement;
