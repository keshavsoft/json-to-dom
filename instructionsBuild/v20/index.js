/**
 * instructionsBuild v20
 * Story: Pure JSON Specification Compiler
 * Takes Structure (or Hybrid Blueprint) + Field Instructions + Data Payload -> Emits Valid Spec JSON.
 */

import compileStructure from "./instructionEngine/compileStructure.js";
import compileTemplate from "./instructionEngine/compileTemplate.js";
import normalizeSpec from "./instructionEngine/normalizeSpec.js";
import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "20.0.0",
    name: "instructionsBuild v20 - Pure JSON Spec Compiler",
    description: "Compiles structure/hybrid + instructions + data into a valid JSON spec"
};

/**
 * Main entry point: compiles structure, instructions, and data into a pure JSON spec.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inStructure - UI structure or hybrid unit
 * @param {Object|Array} inArgs.inInstructions - Field definitions or binding rules
 * @param {Object} inArgs.inData - Business data values
 * @returns {Object|Array} - Compiled JSON spec
 */
export const compile = ({ inStructure, inInstructions = {}, inData = {} } = {}) => {
    const localStructure = inStructure;
    const localInstructions = inInstructions;
    const localData = inData;

    return compileStructure({
        inStructure: localStructure,
        inInstructions: localInstructions,
        inData: localData
    });
};

export {
    compileStructure,
    compileTemplate,
    normalizeSpec,
    resolvePath
};

export default compile;
