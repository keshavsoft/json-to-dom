import resolvePath from "./resolvePath.js";
import applyBindings from "./applyBindings.js";

/**
 * Executes a single instruction against data.
 * 
 * @param {Object} inArgs
 * @param {Object} inArgs.inInstruction - The instruction configuration
 * @param {any} inArgs.inData - The root data payload
 * @param {any} [inArgs.inContextData] - The local context data item (if nested)
 * @param {Function} [inArgs.inResolveNodeFn] - Recursive resolution callback for child nodes
 * @returns {any} - The generated spec node or array of spec nodes
 */
export const executeInstruction = ({
    inInstruction,
    inData,
    inContextData,
    inResolveNodeFn
}) => {
    const localInstruction = inInstruction;
    const localData = inData;
    const localContextData = inContextData;
    const localResolveNodeFn = inResolveNodeFn;

    if (!localInstruction) return null;

    const localType = localInstruction.type || "bind";
    const localDataSource = localContextData !== undefined ? localContextData : localData;

    const localTargetData = localInstruction.dataPath !== undefined
        ? resolvePath({ inData: localDataSource, inPath: localInstruction.dataPath })
        : localDataSource;

    // --- 1. LOOP INSTRUCTION ---
    if (localType === "loop" || localType === "iterate") {
        if (!Array.isArray(localTargetData)) {
            return [];
        }

        const localTemplate = localInstruction.itemTemplate || {};
        const localBindings = localInstruction.bindings || localTemplate.bindings || {};
        const localResultNodes = [];

        localTargetData.forEach((localItem, localIndex) => {
            const localItemWithMeta = (typeof localItem === "object" && localItem !== null)
                ? { ...localItem, $index: localIndex, $item: localItem }
                : { value: localItem, $index: localIndex, $item: localItem };

            const localBoundNode = applyBindings({
                inNodeTemplate: localTemplate,
                inDataItem: localItemWithMeta,
                inBindings: localBindings
            });

            delete localBoundNode.bindings;
            delete localBoundNode.instruction;

            let localFinalNode = localBoundNode;
            if (typeof localResolveNodeFn === "function") {
                localFinalNode = localResolveNodeFn({
                    inNode: localBoundNode,
                    inContextData: localItemWithMeta
                });
            }

            if (localFinalNode) {
                localResultNodes.push(localFinalNode);
            }
        });

        return localResultNodes;
    }

    // --- 2. CONDITIONAL INSTRUCTION ---
    if (localType === "conditional" || localType === "if") {
        let localConditionMet = false;

        if (localInstruction.condition) {
            const localCond = localInstruction.condition;
            const localActual = resolvePath({ inData: localTargetData, inPath: localCond.path || "" });

            switch (localCond.operator) {
                case "equals":
                case "==":
                case "===":
                    localConditionMet = localActual === localCond.value;
                    break;
                case "notEquals":
                case "!=":
                case "!==":
                    localConditionMet = localActual !== localCond.value;
                    break;
                case "truthy":
                    localConditionMet = Boolean(localActual);
                    break;
                case "falsy":
                    localConditionMet = !localActual;
                    break;
                case "contains":
                    localConditionMet = Array.isArray(localActual) || typeof localActual === "string"
                        ? localActual.includes(localCond.value)
                        : false;
                    break;
                default:
                    localConditionMet = Boolean(localActual);
            }
        } else {
            localConditionMet = Boolean(localTargetData);
        }

        const localSelectedTemplate = localConditionMet
            ? localInstruction.thenTemplate
            : localInstruction.elseTemplate;

        if (!localSelectedTemplate) return null;

        const localBound = applyBindings({
            inNodeTemplate: localSelectedTemplate,
            inDataItem: localTargetData,
            inBindings: localInstruction.bindings || localSelectedTemplate.bindings || {}
        });

        delete localBound.bindings;
        delete localBound.instruction;

        if (typeof localResolveNodeFn === "function") {
            return localResolveNodeFn({
                inNode: localBound,
                inContextData: localTargetData
            });
        }

        return localBound;
    }

    // --- 3. BIND INSTRUCTION (Default) ---
    const localTemplate = localInstruction.template || {};
    const localBindings = localInstruction.bindings || localTemplate.bindings || {};

    const localBound = applyBindings({
        inNodeTemplate: localTemplate,
        inDataItem: localTargetData,
        inBindings: localBindings
    });

    delete localBound.bindings;
    delete localBound.instruction;

    if (typeof localResolveNodeFn === "function") {
        return localResolveNodeFn({
            inNode: localBound,
            inContextData: localTargetData
        });
    }

    return localBound;
};

export default executeInstruction;
