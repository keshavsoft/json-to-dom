import resolvePath from "./resolvePath.js";

/**
 * Interpolates ${path} variables against local item context and root data payload.
 */
const interpolateString = ({ inText, inItemContext, inRootData }) => {
    const localText = inText;
    const localItemContext = inItemContext;
    const localRootData = inRootData;

    if (typeof localText !== "string" || !localText.includes("${")) {
        return localText;
    }

    return localText.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const key = expr.trim();
        // Check local item context first, then root data
        let val = resolvePath({ inData: localItemContext, inPath: key });
        if (val === undefined && localRootData) {
            val = resolvePath({ inData: localRootData, inPath: key });
        }
        return val !== undefined && val !== null ? String(val) : "";
    });
};

/**
 * Universal JSON-Driven Tree Compiler:
 * Recursively traverses any JSON tree. At any point/step in the tree,
 * if a node specifies an "iterate" operation:
 * { operation: "iterate", source: "columns", template: { ... } }
 * it loops through that collection right at that point and stamps out the template.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inNode - The tree node to compile
 * @param {Object} [inArgs.inContext] - Context dictionary containing named collections (columns, rows, etc.)
 * @param {Object} [inArgs.inRootData] - Business data values
 * @returns {Object|Array} - Compiled JSON specification ready for json-to-dom
 */
export const compileNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext || {};
    const localRootData = inRootData || {};

    if (localNode === null || localNode === undefined) return null;

    // Handle array of nodes: compile each child and flatten
    if (Array.isArray(localNode)) {
        const flattened = [];
        for (const child of localNode) {
            const compiledChild = compileNode({
                inNode: child,
                inContext: localContext,
                inRootData: localRootData
            });
            if (Array.isArray(compiledChild)) {
                flattened.push(...compiledChild);
            } else if (compiledChild !== null && compiledChild !== undefined) {
                flattened.push(compiledChild);
            }
        }
        return flattened;
    }

    if (typeof localNode !== "object") {
        return interpolateString({
            inText: localNode,
            inItemContext: localContext.item,
            inRootData: localRootData
        });
    }

    // Check for iteration operation!
    const isIteration = localNode.operation === "iterate" || Boolean(localNode.$iterate);
    if (isIteration) {
        const sourceKey = localNode.source || localNode.iterateOn || localNode.$iterate;
        const rawCollection = (localRootData && localRootData[sourceKey])
            || resolvePath({ inData: localRootData, inPath: sourceKey })
            || (localContext && localContext[sourceKey])
            || resolvePath({ inData: localContext, inPath: sourceKey });

        if (!Array.isArray(rawCollection)) return [];

        const template = localNode.template || localNode.item || {};
        const filter = localNode.filter;

        // Filter collection if filter rules are provided
        const filteredCollection = rawCollection.filter(item => {
            if (!item || typeof item !== "object") return true;
            if (filter && typeof filter === "object") {
                for (const [filterKey, filterVal] of Object.entries(filter)) {
                    if (item[filterKey] !== filterVal) return false;
                }
            }
            // Skip isVisible: false by default
            if (item.isVisible === false) return false;
            return true;
        });

        // Stamp out each item from the collection
        const results = [];
        filteredCollection.forEach((item, index) => {
            const itemContext = {
                ...localContext,
                item,
                ...item,
                $index: index
            };

            const compiledItem = compileNode({
                inNode: template,
                inContext: itemContext,
                inRootData: localRootData
            });

            if (Array.isArray(compiledItem)) {
                results.push(...compiledItem);
            } else if (compiledItem !== null && compiledItem !== undefined) {
                results.push(compiledItem);
            }
        });

        return results;
    }

    // Standard tree node
    const cloned = { ...localNode };
    const currentItem = localContext.item || localContext;

    // Handle control transformation (e.g. textarea)
    if (currentItem.type === "textarea" && cloned.tagName === "input") {
        cloned.tagName = "textarea";
        if (cloned.attributes) {
            cloned.attributes = { ...cloned.attributes };
            delete cloned.attributes.type;
        }
    }

    if (cloned.textContent) {
        cloned.textContent = interpolateString({
            inText: cloned.textContent,
            inItemContext: currentItem,
            inRootData: localRootData
        });
    }

    if (cloned.attributes) {
        cloned.attributes = { ...cloned.attributes };
        for (const [attrName, attrVal] of Object.entries(cloned.attributes)) {
            if (typeof attrVal === "string") {
                cloned.attributes[attrName] = interpolateString({
                    inText: attrVal,
                    inItemContext: currentItem,
                    inRootData: localRootData
                });
            }
        }

        // Bind data value if matching field name exists or item has value
        const fieldName = currentItem.field || currentItem.columnName || currentItem.name;
        if (currentItem.value !== undefined && currentItem.value !== null) {
            cloned.attributes.value = String(currentItem.value);
        } else if (fieldName && localRootData[fieldName] !== undefined && localRootData[fieldName] !== null) {
            cloned.attributes.value = String(localRootData[fieldName]);
        } else if (fieldName && localRootData.values && localRootData.values[fieldName] !== undefined && localRootData.values[fieldName] !== null) {
            cloned.attributes.value = String(localRootData.values[fieldName]);
        }
    }

    // Recursively compile children
    if (Array.isArray(cloned.children)) {
        const compiledChildren = [];
        for (const child of cloned.children) {
            const compiledChild = compileNode({
                inNode: child,
                inContext: localContext,
                inRootData: localRootData
            });
            if (Array.isArray(compiledChild)) {
                compiledChildren.push(...compiledChild);
            } else if (compiledChild !== null && compiledChild !== undefined) {
                compiledChildren.push(compiledChild);
            }
        }
        cloned.children = compiledChildren;
    }

    return cloned;
};

export default compileNode;
