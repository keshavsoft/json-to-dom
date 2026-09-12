import resolvePath from "./resolvePath.js";

/**
 * Interpolates ${key} variables in a string against a context object.
 */
const interpolateText = ({ inText, inContext }) => {
    const localText = inText;
    const localContext = inContext;

    if (typeof localText !== "string" || !localText.includes("${")) {
        return localText;
    }

    return localText.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const key = expr.trim();
        return localContext[key] !== undefined && localContext[key] !== null
            ? String(localContext[key])
            : "";
    });
};

/**
 * Recursively stamps out a node with field context.
 */
const compileNodeWithContext = ({ inNode, inContext, inData, inInstructions }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;
    const localInstructions = inInstructions;

    if (!localNode || typeof localNode !== "object") {
        return localNode;
    }

    const cloned = { ...localNode };

    // Interpolate textContent
    if (cloned.textContent) {
        cloned.textContent = interpolateText({
            inText: cloned.textContent,
            inContext: localContext
        });
    }

    // Interpolate attributes
    if (cloned.attributes) {
        cloned.attributes = { ...cloned.attributes };
        for (const [attrName, attrVal] of Object.entries(cloned.attributes)) {
            if (typeof attrVal === "string") {
                cloned.attributes[attrName] = interpolateText({
                    inText: attrVal,
                    inContext: localContext
                });
            }
        }

        // Inject bound value on input/select/textarea
        if (localContext.value !== undefined && localContext.value !== null && localContext.value !== "") {
            cloned.attributes.value = String(localContext.value);
        }
    }

    // Recursively compile children
    if (Array.isArray(cloned.children)) {
        cloned.children = cloned.children.map(child => compileNodeWithContext({
            inNode: child,
            inContext: localContext,
            inData: localData,
            inInstructions: localInstructions
        }));
    }

    return cloned;
};

/**
 * Compiles a UI structure tree by applying instructions and data.
 * 
 * Supports two powerful modes:
 * 1. Template Mode: structure.json contains pure row layout (NO user data).
 *    instructions.json defines the fields to generate.
 *    Adding new rows later only requires adding a field to instructions.json!
 * 2. Static Array Mode: structure.json contains pre-defined rows (proof.json style).
 *    compileStructure iterates through and injects values by name.
 * 
 * @param {Object} inArgs
 * @param {Array|Object} inArgs.inStructure - The structure skeleton
 * @param {Object|Array} [inArgs.inInstructions] - Instruction rules and field definitions
 * @param {Object} [inArgs.inData] - Business data payload
 * @returns {Array|Object} - Compiled JSON specification ready for v14 DOM engine
 */
export const compileStructure = ({
    inStructure,
    inInstructions = {},
    inData = {}
} = {}) => {
    const localStructure = inStructure;
    const localInstructions = inInstructions || {};
    const localData = inData || {};

    if (localStructure === null || localStructure === undefined) return null;

    // Check if instructions defines a list of fields to stamp out
    const localFields = Array.isArray(localInstructions)
        ? localInstructions
        : (Array.isArray(localInstructions.fields)
            ? localInstructions.fields
            : (localInstructions.bindInvoiceForm?.fields || null));

    // Mode 1: Pure Template Mode - structure is row layout, instructions defines fields
    if (localFields && localFields.length > 0 && !Array.isArray(localStructure)) {
        return localFields.map(field => {
            const dataVal = resolvePath({ inData: localData, inPath: field.name });
            const fieldContext = {
                ...field,
                value: dataVal !== undefined && dataVal !== null ? dataVal : ""
            };
            return compileNodeWithContext({
                inNode: localStructure,
                inContext: fieldContext,
                inData: localData,
                inInstructions: localInstructions
            });
        });
    }

    // Mode 2: Array of pre-defined rows (proof.json)
    if (Array.isArray(localStructure)) {
        return localStructure.map(item => compileStructure({
            inStructure: item,
            inInstructions: localInstructions,
            inData: localData
        }));
    }

    if (typeof localStructure !== "object") {
        return localStructure;
    }

    // Mode 3: Single pre-defined node
    const localNode = { ...localStructure };
    const localBindings = localInstructions.bindings
        || (localInstructions.bindInvoiceForm && localInstructions.bindInvoiceForm.bindings)
        || {};

    if (localNode.attributes) {
        localNode.attributes = { ...localNode.attributes };
        const localName = localNode.attributes.name;
        if (localName) {
            const localDataKey = localBindings[localName] || localName;
            const localBoundValue = resolvePath({ inData: localData, inPath: localDataKey });
            if (localBoundValue !== undefined && localBoundValue !== null) {
                localNode.attributes.value = String(localBoundValue);
            }
        }
    }

    if (typeof localNode.textContent === "string" && localNode.textContent.includes("${")) {
        localNode.textContent = interpolateText({
            inText: localNode.textContent,
            inContext: localData
        });
    }

    if (Array.isArray(localNode.children)) {
        localNode.children = localNode.children.map(child => compileStructure({
            inStructure: child,
            inInstructions: localInstructions,
            inData: localData
        }));
    }

    return localNode;
};

export default compileStructure;
