/**
 * instructionsBuild v22
 * Story: The Minimalist 2-File JSON Spec Compiler
 * Inputs: structure.json (UI blueprint & operations) + data.json (collections & values).
 * Traverses structure.json recursively, resolving dynamic node operations directly against data.json.
 */

import compileNode from "./instructionEngine/compileTree.js";
import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "22.0.0",
    name: "instructionsBuild v22 - Minimalist 2-File Spec Compiler",
    description: "Compiles structure.json with data.json into valid JSON specs ready for json-to-dom"
};

/**
 * Main entry point: compiles a structure tree with operations driven by data.json.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inStructure - The JSON UI structure/blueprint (from structure.json)
 * @param {Object|Array} [inArgs.inTree] - Alias for inStructure
 * @param {Object} [inArgs.inData] - Business data payload containing collections and values (from data.json)
 * @returns {Object|Array} - Compiled valid JSON spec ready for json-to-dom
 */
export const compile = ({
    inStructure,
    inTree,
    inData = {}
} = {}) => {
    const localStructure = inStructure || inTree;
    const localTree = inTree;
    const localData = inData || {};

    return compileNode({
        inNode: localStructure,
        inContext: localData,
        inRootData: localData
    });
};

export {
    compileNode,
    resolvePath
};

export default compile;
