import resolveSpec, {
    resolvePath,
    setNestedValue,
    applyBindings,
    executeInstruction
} from "./instructionEngine/index.js";

import buildSpecElement, {
    jsonToDom,
    buildSpecElementWithEvents,
    specToDom,
    applyEvents,
    getHookedEvents,
    validate,
    data,
    blues,
    domToSpec,
    getStartSpec,
    reverse
} from "../v14/index.js";

export const meta = {
    version: "15.0.0",
    name: "json-to-dom with Declarative Instruction Engine",
    description: "Resolves structure.json, instructions.json, and data.json into DOM specs"
};

/**
 * High-level helper: Resolves structure + instructions + data into spec, then builds DOM elements.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inStructure - Layout structure
 * @param {Object} [inArgs.inInstructions] - Instruction dictionary
 * @param {Object|Array} [inArgs.inData] - Data payload
 * @param {boolean} [inArgs.inApplyEvents=true] - Whether to bind event listeners
 * @param {boolean} [inArgs.inShowLog=false] - Whether to enable debug logs
 * @returns {HTMLElement|DocumentFragment|Array<HTMLElement>|null}
 */
const render = ({
    inStructure,
    inInstructions = {},
    inData = {},
    inApplyEvents = true,
    inShowLog = false
} = {}) => {
    const localStructure = inStructure;
    const localInstructions = inInstructions;
    const localData = inData;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    const localSpec = resolveSpec({
        inStructure: localStructure,
        inInstructions: localInstructions,
        inData: localData
    });

    return buildSpecElement({
        inSpec: localSpec,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });
};

/**
 * High-level helper: Resolves structure + instructions + data, builds DOM, and mounts to a container.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inStructure - Layout structure
 * @param {Object} [inArgs.inInstructions] - Instruction dictionary
 * @param {Object|Array} [inArgs.inData] - Data payload
 * @param {string} inArgs.inDomIdToPushTo - Target DOM element id
 * @param {boolean} [inArgs.inApplyEvents=true] - Whether to bind event listeners
 * @param {boolean} [inArgs.inShowLog=false] - Whether to enable debug logs
 * @returns {HTMLElement|DocumentFragment|Array<HTMLElement>|null}
 */
/**
 * Renders a compiled json-to-dom spec (That Last JSON) directly to a DOM container.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inSpec - The compiled spec JSON
 * @param {string} inArgs.inDomIdToPushTo - Target container ID
 * @param {boolean} [inArgs.inApplyEvents=true]
 * @param {boolean} [inArgs.inShowLog=false]
 * @returns {HTMLElement|DocumentFragment|Array<HTMLElement>|null}
 */
const renderSpecToDom = ({
    inSpec,
    inDomIdToPushTo,
    inApplyEvents = true,
    inShowLog = false
} = {}) => {
    const localSpec = inSpec;
    const localDomIdToPushTo = inDomIdToPushTo;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    const localContainer = typeof document !== "undefined"
        ? document.getElementById(localDomIdToPushTo)
        : null;

    if (localContainer) {
        localContainer.innerHTML = "";
    }

    const localDomElement = buildSpecElement({
        inSpec: localSpec,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });

    if (localContainer && localDomElement) {
        if (Array.isArray(localDomElement)) {
            localContainer.append(...localDomElement);
        } else {
            localContainer.appendChild(localDomElement);
        }
    }

    return localDomElement;
};

/**
 * High-level helper: Resolves structure + instructions + data, builds DOM, and mounts to a container.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inStructure - Layout structure
 * @param {Object} [inArgs.inInstructions] - Instruction dictionary
 * @param {Object|Array} [inArgs.inData] - Data payload
 * @param {string} inArgs.inDomIdToPushTo - Target DOM element id
 * @param {boolean} [inArgs.inApplyEvents=true] - Whether to bind event listeners
 * @param {boolean} [inArgs.inShowLog=false] - Whether to enable debug logs
 * @returns {HTMLElement|DocumentFragment|Array<HTMLElement>|null}
 */
const renderToDom = ({
    inStructure,
    inInstructions = {},
    inData = {},
    inDomIdToPushTo,
    inApplyEvents = true,
    inShowLog = false
} = {}) => {
    const localStructure = inStructure;
    const localInstructions = inInstructions;
    const localData = inData;
    const localDomIdToPushTo = inDomIdToPushTo;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    const localSpec = resolveSpec({
        inStructure: localStructure,
        inInstructions: localInstructions,
        inData: localData
    });

    return renderSpecToDom({
        inSpec: localSpec,
        inDomIdToPushTo: localDomIdToPushTo,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });
};

export const instructionEngine = {
    resolveSpec,
    resolvePath,
    setNestedValue,
    applyBindings,
    executeInstruction
};

export const tree = {
    meta,
    instructionEngine,
    jsonToDom,
    reverse,
    resolveSpec,
    render,
    renderToDom,
    renderSpecToDom
};

export {
    resolveSpec,
    render,
    renderToDom,
    renderSpecToDom,
    buildSpecElement,
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

export default render;
