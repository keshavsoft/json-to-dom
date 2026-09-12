import resolvePath from "./resolvePath.js";

/**
 * Interpolates ${key} expressions in a string against column metadata.
 */
const interpolateString = ({ inText, inContext }) => {
    const localText = inText;
    const localContext = inContext;

    if (typeof localText !== "string" || !localText.includes("${")) {
        return localText;
    }

    return localText.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const key = expr.trim();
        const val = resolvePath({ inData: localContext, inPath: key });
        return val !== undefined && val !== null ? String(val) : "";
    });
};

/**
 * Recursively stamps a row node template with column metadata and bound data value.
 */
const stampNode = ({ inNode, inColumn, inData }) => {
    const localNode = inNode;
    const localColumn = inColumn;
    const localData = inData;

    if (!localNode || typeof localNode !== "object") return localNode;

    const cloned = { ...localNode };

    // Support textarea transformation if column specifies type="textarea"
    if (localColumn.type === "textarea" && cloned.tagName === "input") {
        cloned.tagName = "textarea";
        if (cloned.attributes) {
            cloned.attributes = { ...cloned.attributes };
            delete cloned.attributes.type;
        }
    }

    if (cloned.textContent) {
        cloned.textContent = interpolateString({
            inText: cloned.textContent,
            inContext: localColumn
        });
    }

    if (cloned.attributes) {
        cloned.attributes = { ...cloned.attributes };
        for (const [attr, val] of Object.entries(cloned.attributes)) {
            if (typeof val === "string") {
                cloned.attributes[attr] = interpolateString({
                    inText: val,
                    inContext: localColumn
                });
            }
        }

        // Set value from data payload matching field name
        const fieldName = localColumn.field || localColumn.columnName || localColumn.name;
        if (fieldName && localData[fieldName] !== undefined && localData[fieldName] !== null) {
            cloned.attributes.value = String(localData[fieldName]);
        }
    }

    if (Array.isArray(cloned.children)) {
        cloned.children = cloned.children.map(child => stampNode({
            inNode: child,
            inColumn: localColumn,
            inData: localData
        }));
    }

    return cloned;
};

/**
 * The Iteration Tool:
 * Iterates through a columns collection, filters out hidden columns (isVisible: false),
 * stamps out row templates, injects data values, and populates the dynamic form body.
 * 
 * @param {Object} inArgs
 * @param {Array} inArgs.inColumns - Array of column metadata (e.g. columns.json)
 * @param {Object} inArgs.inStructure - Form structure containing { formShell, rowTemplate }
 * @param {Object} [inArgs.inData] - Business data payload mapping field -> value
 * @param {Object} [inArgs.inInstructions] - Optional instructions (filters, overrides)
 * @returns {Object|Array} - Compiled complete form spec JSON
 */
export const compileIteration = ({
    inColumns,
    inStructure,
    inData = {},
    inInstructions = {}
} = {}) => {
    const localColumns = Array.isArray(inColumns) ? inColumns : [];
    const localStructure = inStructure || {};
    const localData = inData || {};
    const localInstructions = inInstructions || {};

    // 1. Filter columns: skip isVisible === false or hidden primary keys
    const activeColumns = localColumns.filter(col => {
        if (col.isVisible === false) return false;
        if (col.primary === true && col.isVisible !== true) return false;
        return true;
    });

    // 2. Extract row template and form shell
    const rowTemplate = localStructure.rowTemplate || localStructure;
    const formShell = localStructure.formShell ? JSON.parse(JSON.stringify(localStructure.formShell)) : null;

    // 3. Stamp out dynamic rows for each active column
    const generatedRows = activeColumns.map(col => {
        return stampNode({
            inNode: rowTemplate,
            inColumn: col,
            inData: localData
        });
    });

    // 4. If formShell exists, inject the rows into the dynamic body container (#form-body)
    if (formShell) {
        const findAndInjectBody = (node) => {
            if (node.attributes?.id === "form-body" || node.slot === "body") {
                node.children = generatedRows;
                return true;
            }
            if (Array.isArray(node.children)) {
                for (const child of node.children) {
                    if (findAndInjectBody(child)) return true;
                }
            }
            return false;
        };

        const injected = findAndInjectBody(formShell);
        if (!injected && Array.isArray(formShell.children)) {
            formShell.children.push(...generatedRows);
        }
        return formShell;
    }

    // If no shell, return array of generated rows
    return generatedRows;
};

export default compileIteration;
