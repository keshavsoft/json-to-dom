import meta from "./meta.js";
import buildSpecElement, {
    jsonToDom,
    specToDom,
    specToHtml
} from "./jsonToDom/index.js";
import validate from "./validate/index.js";
import data from "./data/index.js";
import registerGlobal from "./jsonToDom/orchestration/2.registerGlobal.js";

export const tree = {
    meta,
    jsonToDom,
    core: jsonToDom.core,
    validate,
    data
};

export {
    meta,
    jsonToDom,
    buildSpecElement,
    specToDom,
    specToHtml,
    validate,
    data
};

registerGlobal({
    inApi: {
        ...tree,
        buildSpecElement,
        specToDom,
        specToHtml
    }
});

export default buildSpecElement;
