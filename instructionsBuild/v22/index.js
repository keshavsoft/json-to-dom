/**
 * instructionsBuild v21
 * Story: 2-File Contract (structure.json + data.json)
 * Compiles UI structure tree with node-level iterations driven directly by data.json.
 */

import compileNode from "./instructionEngine/compileTree.js";
import compileIteration from "./instructionEngine/compileIteration.js";
import compileStructure from "./instructionEngine/compileStructure.js";
import compileTemplate from "./instructionEngine/compileTemplate.js";
import normalizeSpec from "./instructionEngine/normalizeSpec.js";
import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "21.0.0",
    name: "instructionsBuild v21 - 2-File JSON Spec Compiler",
    description: "Compiles structure.json (UI blueprint) with data.json (collections & values) into valid Spec JSON"
};

/**
 * Main entry point: compiles a structure tree with dynamic operations driven by data.json.
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
    compileIteration,
    compileStructure,
    compileTemplate,
    normalizeSpec,
    resolvePath
};

export default compile;
