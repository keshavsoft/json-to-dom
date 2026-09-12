import {
    buildSpecElement as v14BuildSpecElement,
    buildSpecElementWithEvents,
    specToDom,
    domToSpec,
    getStartSpec,
    applyEvents,
    getHookedEvents,
    validate,
    data,
    blues,
    reverse,
    jsonToDom
} from "../v14/index.js";

import {
    compileTemplate,
    compileStructure,
    normalizeSpec,
    resolvePath
} from "./instructionEngine/index.js";

export const meta = {
    version: "18.0.0",
    name: "json-to-dom v18 - 3-JSON Form Engine (v14 DOM Engine)",
    description: "Compiles structure.json + instructions.json + data.json into spec JSON, rendered by v14"
};

/**
 * Builds DOM elements using the v14 engine.
 * Normalizes modern props (className, textContent, dataset, etc.) to standard attributes.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inSpec - The specification object or array
 * @param {boolean} [inArgs.inApplyEvents=true] - Whether to hook events
 * @param {boolean} [inArgs.inShowLog=false] - Whether to show debug logs
 * @returns {HTMLElement|DocumentFragment|Array<HTMLElement>|null}
 */
export const buildSpecElement = ({ inSpec, inApplyEvents = true, inShowLog = false } = {}) => {
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    const normalized = normalizeSpec({ inSpec: localSpec });

    return v14BuildSpecElement({
        inSpec: normalized,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });
};

/**
 * Mounts a spec directly into a DOM container element.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inSpec - The spec to render
 * @param {string} inArgs.inDomIdToPushTo - The target container element id
 * @param {boolean} [inArgs.inApplyEvents=true]
 * @param {boolean} [inArgs.inShowLog=false]
 * @returns {HTMLElement|DocumentFragment|Array<HTMLElement>|null}
 */
export const renderSpecToDom = ({
    inSpec,
    inDomIdToPushTo,
    inApplyEvents = true,
    inShowLog = false
} = {}) => {
    const localSpec = inSpec;
    const localDomIdToPushTo = inDomIdToPushTo;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    const container = typeof document !== "undefined" && localDomIdToPushTo
        ? document.getElementById(localDomIdToPushTo)
        : null;

    if (container) {
        container.innerHTML = "";
    }

    const domElement = buildSpecElement({
        inSpec: localSpec,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });

    if (container && domElement) {
        if (Array.isArray(domElement)) {
            container.append(...domElement);
        } else {
            container.appendChild(domElement);
        }
    }

    return domElement;
};

export const instructionEngine = {
    compileTemplate,
    compileStructure,
    normalizeSpec,
    resolvePath
};

export const tree = {
    meta,
    instructionEngine,
    buildSpecElement,
    renderSpecToDom,
    domToSpec,
    compileTemplate,
    compileStructure,
    normalizeSpec,
    jsonToDom,
    reverse
};

export {
    compileTemplate,
    compileStructure,
    normalizeSpec,
    resolvePath,
    buildSpecElementWithEvents,
    specToDom,
    domToSpec,
    getStartSpec,
    applyEvents,
    getHookedEvents,
    validate,
    data,
    blues,
    reverse,
    jsonToDom
};

export default buildSpecElement;

