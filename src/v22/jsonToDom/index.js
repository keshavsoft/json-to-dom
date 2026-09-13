import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./orchestration/2.dispatchSpec.js";

import meta from "../meta.js";
import validate from "./validate/index.js";
import data from "./data/index.js";

/**
 * buildSpecElement - Pure Element Builder with Explicit Output Type
 * Clean public API (no 'in' prefix required):
 * { spec, outputType = "dom", showLog = false }
 * Or direct spec parameter: buildSpecElement(spec)
 */
const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;

    const isConfig = localArgs && typeof localArgs === "object" 
        && !Array.isArray(localArgs) 
        && !(typeof Node !== "undefined" && localArgs instanceof Node) 
        && ("spec" in localArgs || "inSpec" in localArgs || "outputType" in localArgs || "inOutputType" in localArgs);

    const localSpec = isConfig ? (localArgs.spec ?? localArgs.inSpec) : localArgs;
    const localOutputType = isConfig ? (localArgs.outputType ?? localArgs.inOutputType ?? "dom").toLowerCase() : "dom";
    const localShowLog = isConfig ? Boolean(localArgs.showLog ?? localArgs.inShowLog) : false;

    const { spec, showLog } = normalizeInput({ inSpec: localSpec, inShowLog: localShowLog });
    const domElement = dispatchSpec({ inSpec: spec, inShowLog: showLog });

    // Explicit output switch
    if (localOutputType === "html") {
        if (!domElement) return "";
        return Array.isArray(domElement)
            ? domElement.map(el => el.outerHTML).join("\n")
            : domElement.outerHTML;
    }

    // Default: native DOM element
    return domElement;
};

/**
 * specToDom - Renders spec to native DOM and pushes to target container
 * Clean public API (no 'in' prefix required):
 * { spec, domIdToPushTo, showLog = false }
 */
const specToDom = (inArgs = {}) => {
    const localArgs = inArgs;

    const localSpec = localArgs.spec ?? localArgs.inSpec;
    const localDomIdToPushTo = localArgs.domIdToPushTo ?? localArgs.inDomIdToPushTo;
    const localShowLog = Boolean(localArgs.showLog ?? localArgs.inShowLog);

    const container = typeof document !== "undefined" && localDomIdToPushTo
        ? document.getElementById(localDomIdToPushTo)
        : null;

    const domElement = buildSpecElement({ spec: localSpec, outputType: "dom", showLog: localShowLog });

    if (container && domElement) {
        if (Array.isArray(domElement)) {
            container.append(...domElement);
        } else {
            container.appendChild(domElement);
        }
    }

    return domElement;
};

/**
 * specToHtml - Serializes spec to static HTML string
 * Clean public API (no 'in' prefix required):
 * { spec, showLog = false }
 */
const specToHtml = (inArgs = {}) => {
    const localArgs = inArgs;

    const localSpec = (localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && ("spec" in localArgs || "inSpec" in localArgs))
        ? (localArgs.spec ?? localArgs.inSpec)
        : localArgs;
    const localShowLog = Boolean(localArgs?.showLog ?? localArgs?.inShowLog);

    return buildSpecElement({ spec: localSpec, outputType: "html", showLog: localShowLog });
};

export const jsonToDom = {
    meta,
    core: { buildSpecElement, specToDom, specToHtml },
    validate,
    data
};

export {
    normalizeInput,
    dispatchSpec,
    buildSpecElement,
    specToDom,
    specToHtml,
    validate,
    data
};

export default buildSpecElement;
