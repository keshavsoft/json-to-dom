import resolvePath from "./resolvePath.js";
import setNestedValue from "./setNestedValue.js";

/**
 * Applies binding rules from a data item to a node template.
 * Returns a cloned, populated node spec.
 * 
 * @param {Object} inArgs
 * @param {Object} inArgs.inNodeTemplate - The template node spec
 * @param {Object} inArgs.inDataItem - The data item providing values
 * @param {Object} inArgs.inBindings - Map of targetPaths to data paths or expressions
 * @returns {Object} - Cloned node spec with bound values
 */
export const applyBindings = ({ inNodeTemplate, inDataItem, inBindings }) => {
    const localNodeTemplate = inNodeTemplate;
    const localDataItem = inDataItem;
    const localBindings = inBindings;

    if (!localNodeTemplate) return null;
    if (!localBindings || typeof localBindings !== "object") {
        return typeof structuredClone === "function"
            ? structuredClone(localNodeTemplate)
            : JSON.parse(JSON.stringify(localNodeTemplate));
    }

    const localClone = typeof structuredClone === "function"
        ? structuredClone(localNodeTemplate)
        : JSON.parse(JSON.stringify(localNodeTemplate));

    for (const [localTargetPath, localBindingRule] of Object.entries(localBindings)) {
        let localResolvedValue;

        if (typeof localBindingRule === "string") {
            if (localBindingRule.includes("${")) {
                localResolvedValue = localBindingRule.replace(/\$\{([^}]+)\}/g, (_, localExpr) => {
                    const localVal = resolvePath({ inData: localDataItem, inPath: localExpr.trim() });
                    return localVal !== undefined && localVal !== null ? String(localVal) : "";
                });
            } else {
                localResolvedValue = resolvePath({ inData: localDataItem, inPath: localBindingRule });
            }
        } else if (typeof localBindingRule === "object" && localBindingRule !== null) {
            const localSourcePath = localBindingRule.path || "";
            const localRawValue = resolvePath({ inData: localDataItem, inPath: localSourcePath });
            const localPrefix = localBindingRule.prefix || "";
            const localSuffix = localBindingRule.suffix || "";
            const localDefault = localBindingRule.default !== undefined ? localBindingRule.default : "";

            if (localRawValue !== undefined && localRawValue !== null) {
                localResolvedValue = `${localPrefix}${localRawValue}${localSuffix}`;
            } else {
                localResolvedValue = localDefault;
            }
        }

        if (localResolvedValue !== undefined) {
            setNestedValue({
                inTarget: localClone,
                inPath: localTargetPath,
                inValue: localResolvedValue
            });
        }
    }

    return localClone;
};

export default applyBindings;
