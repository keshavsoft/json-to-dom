/**
 * json-to-dom v28 — The Story of a Living DOM Element
 * 
 * Chapter 1: Inspection   — W3C HTML standards & pre-flight specification validation
 * Chapter 2: Construction — Native DOM assembly line (preserved Steps 0 to 5)
 * Chapter 3: Activation   — Event delegation, form extraction & container mounting
 */

import meta from "./meta.js";
import { validate, validateSpec, standards, data } from "./chapters/chapter1_inspection/index.js";
import { dispatchSpec, normalizeInput, elementBuilder } from "./chapters/chapter2_construction/index.js";
import { listeners, bindActions, formOperations, mountToContainer } from "./chapters/chapter3_activation/index.js";
import registerGlobal from "./chapters/chapter2_construction/orchestration/2.registerGlobal.js";

/**
 * buildSpecElement - Pure Element Builder with Explicit Output Type & Opt-in Validation
 * 
 * Outside API:
 * - buildSpecElement({ spec, outputType = "dom", showLog = false, validate = false })
 * - buildSpecElement(spec)
 * 
 * @param {Object|Array} inArgs - Spec configuration or direct spec object/array
 * @returns {HTMLElement|Array<HTMLElement>|string} Materialized DOM or HTML string
 */
export const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;

    const isConfig = localArgs && typeof localArgs === "object" 
        && !Array.isArray(localArgs) 
        && !(typeof Node !== "undefined" && localArgs instanceof Node) 
        && ("spec" in localArgs || "inSpec" in localArgs || "outputType" in localArgs || "inOutputType" in localArgs || "validate" in localArgs || "inValidate" in localArgs || "debug" in localArgs || "inDebug" in localArgs);

    const localSpec = isConfig ? (localArgs.spec ?? localArgs.inSpec) : localArgs;
    const localOutputType = isConfig ? (localArgs.outputType ?? localArgs.inOutputType ?? "dom").toLowerCase() : "dom";
    const localShowLog = isConfig ? Boolean(localArgs.showLog ?? localArgs.inShowLog) : false;
    const localValidate = isConfig ? Boolean(localArgs.validate ?? localArgs.inValidate ?? localArgs.debug ?? localArgs.inDebug) : false;

    // Chapter 1: Inspection (opt-in validation)
    if (localValidate && localSpec) {
        const validationResult = validate({ inSpec: localSpec });
        if (!validationResult.isValid) {
            console.warn("[json-to-dom v28: validation error]", validationResult.errors, validationResult);
        } else if (validationResult.warnings && validationResult.warnings.length > 0 && localShowLog) {
            console.warn("[json-to-dom v28: validation warning]", validationResult.warnings);
        }
    }

    // Chapter 2: Construction (Steps 0 to 5)
    const { spec, showLog } = normalizeInput({ inSpec: localSpec, inShowLog: localShowLog });
    const domElement = dispatchSpec({ inSpec: spec, inShowLog: showLog });

    // Explicit output format switch
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
 * specToDom - Renders spec to native DOM and mounts to target container
 * 
 * Outside API:
 * - specToDom({ spec, targetHtmlId, domIdToPushTo, showLog = false, validate = false })
 * 
 * @param {Object} inArgs - Configuration options
 * @returns {HTMLElement|Array<HTMLElement>} Constructed DOM element(s)
 */
export const specToDom = (inArgs = {}) => {
    const localArgs = inArgs;
    const localSpec = localArgs.spec ?? localArgs.inSpec;
    const localContainerId = localArgs.targetHtmlId ?? localArgs.domIdToPushTo ?? localArgs.inDomIdToPushTo;
    const localShowLog = Boolean(localArgs.showLog ?? localArgs.inShowLog);
    const localValidate = Boolean(localArgs.validate ?? localArgs.inValidate ?? localArgs.debug ?? localArgs.inDebug);

    const element = buildSpecElement({
        spec: localSpec,
        outputType: "dom",
        showLog: localShowLog,
        validate: localValidate
    });

    if (localContainerId && typeof document !== "undefined") {
        mountToContainer({
            element,
            targetHtmlId: localContainerId
        });
    }

    return element;
};

/**
 * specToHtml - Converts a spec directly to an HTML string
 * 
 * @param {Object|Array} inArgs - Spec object or options
 * @returns {string} Outer HTML string
 */
export const specToHtml = (inArgs = {}) => {
    return buildSpecElement({
        spec: inArgs.spec ?? inArgs.inSpec ?? inArgs,
        outputType: "html"
    });
};

export const jsonToDom = buildSpecElement;
jsonToDom.buildSpecElement = buildSpecElement;
jsonToDom.specToDom = specToDom;
jsonToDom.specToHtml = specToHtml;
jsonToDom.core = elementBuilder;

export const tree = {
    meta,
    jsonToDom,
    core: elementBuilder,
    validate,
    data,
    listeners
};

export {
    meta,
    validate,
    validateSpec,
    standards,
    data,
    listeners,
    bindActions,
    formOperations,
    elementBuilder
};

registerGlobal({
    inApi: {
        ...tree,
        buildSpecElement,
        specToDom,
        specToHtml,
        bindActions
    }
});

export default buildSpecElement;
