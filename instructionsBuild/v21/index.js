/**
 * instructionsBuild v20
 * Story: Pure JSON-Driven Tree Compiler
 * Recursively traverses any JSON tree, executing node-level operations (e.g. iterate) on the fly.
 */

import compileNode from "./instructionEngine/compileTree.js";
import compileIteration from "./instructionEngine/compileIteration.js";
import compileStructure from "./instructionEngine/compileStructure.js";
import compileTemplate from "./instructionEngine/compileTemplate.js";
import normalizeSpec from "./instructionEngine/normalizeSpec.js";
import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "20.0.0",
    name: "instructionsBuild v20 - JSON-Driven Tree Compiler",
    description: "Traverses any JSON tree, executing node-level iteration operations dynamically"
};

/**
 * Main entry point: compiles a tree with dynamic node-level operations.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inTree - The JSON tree to compile (e.g. form, table, or template)
 * @param {Object|Array} [inArgs.inStructure] - Alias for inTree
 * @param {Object} [inArgs.inContext] - Context dictionary containing collections (columns, rows, items)
 * @param {Array} [inArgs.inColumns] - Shortcut to pass columns collection directly
 * @param {Object} [inArgs.inData] - Business data payload
 * @returns {Object|Array} - Compiled valid JSON spec ready for json-to-dom
 */
export const compile = ({
    inTree,
    inStructure,
    inContext = {},
    inColumns,
    inData = {},
    inInstructions = {}
} = {}) => {
    const localTree = inTree || inStructure;
    const localStructure = inStructure;
    const localInContext = inContext || {};
    const localColumns = inColumns;
    const localData = inData || {};
    const localInstructions = inInstructions || {};

    const localContext = {
        columns: localColumns || localInContext.columns,
        ...localInContext
    };

    return compileNode({
        inNode: localTree,
        inContext: localContext,
        inRootData: localData
    });
};

export {
    compileNode,
    compileIteration,
    compileStructure,
    compileTemplate,
    normalizeSpec,
    resolvePath
};

export default compile;
