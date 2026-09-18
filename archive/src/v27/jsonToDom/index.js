import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./buildSpec/index.js";

import meta from "../meta.js";
import validate from "../validate/index.js";

/**
 * buildSpecElement - Pure Element Builder with Explicit Output Type & Opt-in Validation
 * Clean public API (no 'in' prefix required):
 * { spec, outputType = "dom", showLog = false, validate = false }
 * Or direct spec parameter: buildSpecElement(spec)
 */
const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;

    const isConfig = localArgs && typeof localArgs === "object" 
        && !Array.isArray(localArgs) 
        && !(typeof Node !== "undefined" && localArgs instanceof Node) 
        && ("spec" in localArgs || "inSpec" in localArgs || "outputType" in localArgs || "inOutputType" in localArgs || "validate" in localArgs || "inValidate" in localArgs || "debug" in localArgs || "inDebug" in localArgs);

    const localSpec = isConfig ? (localArgs.spec ?? localArgs.inSpec) : localArgs;
    const localOutputType = isConfig ? (localArgs.outputType ?? localArgs.inOutputType ?? "dom").toLowerCase() : "dom";
    const localShowLog = isConfig ? Boolean(localArgs.showLog ?? localArgs.inShowLog) : false;
    const localValidate = isConfig ? Boolean(localArgs.validate ?? localArgs.inValidate ?? localArgs.debug ?? localArgs.inDebug) : false;

    // Opt-in validation: zero overhead when validate is false (default)
    if (localValidate && localSpec) {
        const validationResult = validate({ spec: localSpec });
        if (!validationResult.isValid) {
            console.warn("[json-to-dom v25: validation error]", validationResult.errors, validationResult);
        } else if (validationResult.warnings && validationResult.warnings.length > 0 && localShowLog) {
            console.warn("[json-to-dom v25: validation warning]", validationResult.warnings);
        }
    }

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
 * { spec, domIdToPushTo, showLog = false, validate = false }
 */
const specToDom = (inArgs = {}) => {
    const localArgs = inArgs;

    const localSpec = localArgs.spec ?? localArgs.inSpec;
    const localDomIdToPushTo = localArgs.domIdToPushTo ?? localArgs.inDomIdToPushTo;
    const localShowLog = Boolean(localArgs.showLog ?? localArgs.inShowLog);
    const localValidate = Boolean(localArgs.validate ?? localArgs.inValidate ?? localArgs.debug ?? localArgs.inDebug);

    const container = typeof document !== "undefined" && localDomIdToPushTo
        ? document.getElementById(localDomIdToPushTo)
        : null;

    const domElement = buildSpecElement({ spec: localSpec, outputType: "dom", showLog: localShowLog, validate: localValidate });

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
 * { spec, showLog = false, validate = false }
 */
const specToHtml = (inArgs = {}) => {
    const localArgs = inArgs;

    const localSpec = (localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && ("spec" in localArgs || "inSpec" in localArgs))
        ? (localArgs.spec ?? localArgs.inSpec)
        : localArgs;
    const localShowLog = Boolean(localArgs?.showLog ?? localArgs?.inShowLog);
    const localValidate = Boolean(localArgs?.validate ?? localArgs?.inValidate ?? localArgs?.debug ?? localArgs?.inDebug);

    return buildSpecElement({ spec: localSpec, outputType: "html", showLog: localShowLog, validate: localValidate });
};

export const jsonToDom = {
    meta,
    core: { buildSpecElement, specToDom, specToHtml }
};

export {
    normalizeInput,
    dispatchSpec,
    buildSpecElement,
    specToDom,
    specToHtml
};

export default buildSpecElement;
