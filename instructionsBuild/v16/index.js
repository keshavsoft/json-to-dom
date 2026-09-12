import {
    buildSpecElement,
    renderSpecToDom,
    domToSpec
} from "./jsonToDom/index.js";

import {
    compileTemplate,
    normalizeSpec,
    resolveSpec,
    resolvePath,
    setNestedValue,
    applyBindings,
    executeInstruction
} from "./instructionEngine/index.js";

export const meta = {
    version: "16.0.0",
    name: "json-to-dom v16 - Direct Spec Engine",
    description: "Natively consumes spec.json directly and renders to DOM with zero external boilerplate"
};

export const instructionEngine = {
    compileTemplate,
    normalizeSpec,
    resolveSpec,
    resolvePath,
    setNestedValue,
    applyBindings,
    executeInstruction
};

export const tree = {
    meta,
    buildSpecElement,
    renderSpecToDom,
    domToSpec,
    normalizeSpec,
    instructionEngine
};

export {
    buildSpecElement,
    renderSpecToDom,
    domToSpec,
    normalizeSpec,
    compileTemplate,
    resolveSpec,
    resolvePath,
    setNestedValue,
    applyBindings,
    executeInstruction
};

export default buildSpecElement;
