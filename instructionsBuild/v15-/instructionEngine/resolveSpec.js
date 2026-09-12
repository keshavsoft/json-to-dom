import executeInstruction from "./executeInstruction.js";
import applyBindings from "./applyBindings.js";
import resolvePath from "./resolvePath.js";

/**
 * Recursively resolves a structure node against instructions and data.
 * 
 * @param {Object} inArgs
 * @param {any} inArgs.inNode - A node from structure.json
 * @param {Object} inArgs.inInstructions - The instructions dictionary
 * @param {any} inArgs.inData - The root data payload
 * @param {any} [inArgs.inContextData] - The local context data item (if nested)
 * @returns {any} - The resolved spec node, array of nodes, or null
 */
const resolveNode = ({ inNode, inInstructions, inData, inContextData }) => {
    const localNode = inNode;
    const localInstructions = inInstructions;
    const localData = inData;
    const localContextData = inContextData;

    if (localNode === null || localNode === undefined) return null;

    // If node is an array, resolve each element and flatten
    if (Array.isArray(localNode)) {
        const localFlattened = [];
        for (const localChild of localNode) {
            const localResolvedChild = resolveNode({
                inNode: localChild,
                inInstructions: localInstructions,
                inData: localData,
                inContextData: localContextData
            });

            if (Array.isArray(localResolvedChild)) {
                localFlattened.push(...localResolvedChild);
            } else if (localResolvedChild !== null && localResolvedChild !== undefined) {
                localFlattened.push(localResolvedChild);
            }
        }
        return localFlattened;
    }

    if (typeof localNode !== "object") return localNode;

    // Check if node points to an instruction
    const localInstructionRef = localNode.instruction || localNode.instructionId;
    let localInstructionDef = null;

    if (typeof localInstructionRef === "string") {
        localInstructionDef = localInstructions[localInstructionRef] || null;
    } else if (typeof localInstructionRef === "object" && localInstructionRef !== null) {
        localInstructionDef = localInstructionRef;
    }

    // Helper for recursive child resolution
    const localChildResolver = ({ inNode: inNestedNode, inContextData: inNestedContext }) => {
        return resolveNode({
            inNode: inNestedNode,
            inInstructions: localInstructions,
            inData: localData,
            inContextData: inNestedContext
        });
    };

    // Case 1: Node has an instruction
    if (localInstructionDef) {
        const localType = localInstructionDef.type || "bind";

        // If it's a loop on a container element (e.g. <ul instruction="userList">)
        if ((localType === "loop" || localType === "iterate") && localNode.tagName) {
            const localContainerSpec = typeof structuredClone === "function"
                ? structuredClone(localNode)
                : JSON.parse(JSON.stringify(localNode));

            delete localContainerSpec.instruction;
            delete localContainerSpec.instructionId;

            // Generate child items from the instruction
            const localChildrenSpecs = executeInstruction({
                inInstruction: localInstructionDef,
                inData: localData,
                inContextData: localContextData,
                inResolveNodeFn: localChildResolver
            });

            localContainerSpec.children = Array.isArray(localChildrenSpecs) ? localChildrenSpecs : [];
            return localContainerSpec;
        }

        // If it's a bind instruction on an existing structure node (e.g. <div instruction="bindHeader">)
        if (localType === "bind" && localNode.tagName) {
            const localClonedNode = typeof structuredClone === "function"
                ? structuredClone(localNode)
                : JSON.parse(JSON.stringify(localNode));

            delete localClonedNode.instruction;
            delete localClonedNode.instructionId;

            const localBindings = localInstructionDef.bindings || {};
            const localTargetData = localInstructionDef.dataPath !== undefined
                ? resolvePath({ inData: localContextData || localData, inPath: localInstructionDef.dataPath })
                : (localContextData || localData);

            const localBoundNode = applyBindings({
                inNodeTemplate: localClonedNode,
                inDataItem: localTargetData,
                inBindings: localBindings
            });

            // Also resolve any children that might have nested instructions
            if (Array.isArray(localBoundNode.children)) {
                const localResolvedChildren = [];
                for (const localChild of localBoundNode.children) {
                    const localRes = localChildResolver({ inNode: localChild, inContextData: localTargetData });
                    if (Array.isArray(localRes)) {
                        localResolvedChildren.push(...localRes);
                    } else if (localRes !== null && localRes !== undefined) {
                        localResolvedChildren.push(localRes);
                    }
                }
                localBoundNode.children = localResolvedChildren;
            }

            return localBoundNode;
        }

        // Otherwise (e.g. placeholder node), instruction replaces this node
        return executeInstruction({
            inInstruction: localInstructionDef,
            inData: localData,
            inContextData: localContextData,
            inResolveNodeFn: localChildResolver
        });
    }

    // Case 2: Standard node without instruction
    let localCurrentNode = typeof structuredClone === "function"
        ? structuredClone(localNode)
        : JSON.parse(JSON.stringify(localNode));

    // Apply inline bindings if present
    if (localCurrentNode.bindings && localContextData !== undefined) {
        localCurrentNode = applyBindings({
            inNodeTemplate: localCurrentNode,
            inDataItem: localContextData,
            inBindings: localCurrentNode.bindings
        });
        delete localCurrentNode.bindings;
    }

    delete localCurrentNode.instruction;
    delete localCurrentNode.instructionId;

    // Recursively resolve children
    if (Array.isArray(localCurrentNode.children)) {
        const localResolvedChildren = [];
        for (const localChild of localCurrentNode.children) {
            const localResolvedChild = resolveNode({
                inNode: localChild,
                inInstructions: localInstructions,
                inData: localData,
                inContextData: localContextData
            });

            if (Array.isArray(localResolvedChild)) {
                localResolvedChildren.push(...localResolvedChild);
            } else if (localResolvedChild !== null && localResolvedChild !== undefined) {
                localResolvedChildren.push(localResolvedChild);
            }
        }
        localCurrentNode.children = localResolvedChildren;
    }

    return localCurrentNode;
};

/**
 * Resolves structure, instructions, and data into a json-to-dom specification.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inStructure - The visual structure/layout JSON
 * @param {Object} [inArgs.inInstructions] - The instructions JSON
 * @param {Object|Array} [inArgs.inData] - The business data JSON
 * @returns {Object|Array} - The resolved spec ready for json-to-dom
 */
export const resolveSpec = ({ inStructure, inInstructions = {}, inData = {} }) => {
    const localStructure = inStructure;
    const localInstructions = inInstructions;
    const localData = inData;

    if (!localStructure) return null;

    return resolveNode({
        inNode: localStructure,
        inInstructions: localInstructions,
        inData: localData,
        inContextData: localData
    });
};

export default resolveSpec;
