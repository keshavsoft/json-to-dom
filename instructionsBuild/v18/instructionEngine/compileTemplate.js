import resolvePath from "./resolvePath.js";

/**
 * Interpolates ${path} expressions within a string against context data.
 */
const interpolateString = ({ inString, inData }) => {
    const localString = inString;
    const localData = inData;

    if (typeof localString !== "string") return localString;
    if (!localString.includes("${")) return localString;

    // If the string is purely "${variable}", preserve original data type
    const exactMatch = localString.match(/^\$\{([^}]+)\}$/);
    if (exactMatch) {
        const resolved = resolvePath({ inData: localData, inPath: exactMatch[1].trim() });
        return resolved !== undefined ? resolved : "";
    }

    return localString.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const resolved = resolvePath({ inData: localData, inPath: expr.trim() });
        return resolved !== undefined && resolved !== null ? String(resolved) : "";
    });
};

/**
 * Recursively interpolates object values.
 */
const interpolateObject = ({ inObj, inData }) => {
    const localObj = inObj;
    const localData = inData;

    if (!localObj || typeof localObj !== "object") {
        return interpolateString({ inString: localObj, inData: localData });
    }

    if (Array.isArray(localObj)) {
        return localObj.map((item) => interpolateObject({ inObj: item, inData: localData }));
    }

    const localResult = {};
    for (const [key, value] of Object.entries(localObj)) {
        localResult[key] = interpolateObject({ inObj: value, inData: localData });
    }
    return localResult;
};

/**
 * Compiles an inline template (which mirrors spec.json) against data.
 * 
 * Supports:
 * - ${fieldName} variables in props, attributes, textContent
 * - "$for": "arrayPath", "item": { ... } loop directives
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inTemplate - The template object mirroring spec.json
 * @param {Object|Array} inArgs.inData - The source data payload (e.g. data_yours.json)
 * @param {Object} [inArgs.inContextData] - Local scoped item if in a loop
 * @returns {Object|Array|null} - The compiled spec matching spec.json
 */
export const compileTemplate = ({ inTemplate, inData, inContextData }) => {
    const localTemplate = inTemplate;
    const localData = inData;
    const localContextData = inContextData !== undefined ? inContextData : localData;

    if (localTemplate === null || localTemplate === undefined) return null;

    if (Array.isArray(localTemplate)) {
        const localFlattened = [];
        for (const localChild of localTemplate) {
            const localCompiled = compileTemplate({
                inTemplate: localChild,
                inData: localData,
                inContextData: localContextData
            });

            if (Array.isArray(localCompiled)) {
                localFlattened.push(...localCompiled);
            } else if (localCompiled !== null && localCompiled !== undefined) {
                localFlattened.push(localCompiled);
            }
        }
        return localFlattened;
    }

    if (typeof localTemplate !== "object") {
        return interpolateString({ inString: localTemplate, inData: localContextData });
    }

    // Check for $for loop directive
    if (localTemplate.$for) {
        const localArrayPath = localTemplate.$for;
        const localArrayData = resolvePath({ inData: localContextData, inPath: localArrayPath });
        const localItemTemplate = localTemplate.item || localTemplate.template || {};

        if (!Array.isArray(localArrayData)) return [];

        const localGeneratedItems = [];
        localArrayData.forEach((localItem, localIndex) => {
            const localItemContext = typeof localItem === "object" && localItem !== null
                ? { ...localItem, $index: localIndex }
                : { value: localItem, $index: localIndex };

            const localCompiledItem = compileTemplate({
                inTemplate: localItemTemplate,
                inData: localData,
                inContextData: localItemContext
            });

            if (localCompiledItem) {
                localGeneratedItems.push(localCompiledItem);
            }
        });

        // If the element itself is a container with $for
        if (localTemplate.tagName) {
            const localContainerClone = { ...localTemplate };
            delete localContainerClone.$for;
            delete localContainerClone.item;
            delete localContainerClone.template;

            if (localContainerClone.props) {
                localContainerClone.props = interpolateObject({
                    inObj: localContainerClone.props,
                    inData: localContextData
                });
            }

            localContainerClone.children = localGeneratedItems;
            return localContainerClone;
        }

        return localGeneratedItems;
    }

    // Standard node
    const localNodeClone = { ...localTemplate };

    if (localNodeClone.props) {
        localNodeClone.props = interpolateObject({
            inObj: localNodeClone.props,
            inData: localContextData
        });
    }

    if (localNodeClone.attributes) {
        localNodeClone.attributes = interpolateObject({
            inObj: localNodeClone.attributes,
            inData: localContextData
        });
    }

    if (localNodeClone.textContent) {
        localNodeClone.textContent = interpolateString({
            inString: localNodeClone.textContent,
            inData: localContextData
        });
    }

    if (Array.isArray(localNodeClone.children)) {
        const localCompiledChildren = [];
        for (const localChild of localNodeClone.children) {
            const localCompiledChild = compileTemplate({
                inTemplate: localChild,
                inData: localData,
                inContextData: localContextData
            });

            if (Array.isArray(localCompiledChild)) {
                localCompiledChildren.push(...localCompiledChild);
            } else if (localCompiledChild !== null && localCompiledChild !== undefined) {
                localCompiledChildren.push(localCompiledChild);
            }
        }
        localNodeClone.children = localCompiledChildren;
    }

    return localNodeClone;
};

export default compileTemplate;
