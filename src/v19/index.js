import meta from "./meta.js";
import buildSpecElement, {
    jsonToDom,
    buildSpecElementWithEvents,
    specToDom,
    applyEvents,
    getHookedEvents,
    validate,
    data
} from "./jsonToDom/index.js";
import listeners, { attachRowListener } from "./listeners/index.js";
import registerGlobal from "./jsonToDom/orchestration/3.registerGlobal.js";

export const tree = {
    meta,
    jsonToDom,
    core: jsonToDom.core,
    events: jsonToDom.events,
    listeners,
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
    listeners,
    attachRowListener,
    validate,
    data
};

registerGlobal({
    inApi: {
        ...tree,
        buildSpecElement,
        buildSpecElementWithEvents,
        specToDom,
        applyEvents,
        getHookedEvents,
        listeners,
        attachRowListener
    }
});

export default buildSpecElement;
