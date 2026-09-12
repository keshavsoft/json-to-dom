/**
 * Normalizes a spec node so that both modern `props` (like spec.json)
 * and classic `attributes`/`textContent` (like tags.json) are supported.
 * 
 * Maps:
 * - props.className -> attributes.class
 * - props.textContent -> textContent
 * - props.dataset.* -> attributes['data-*']
 * - props.src, props.alt, props.href, etc. -> attributes.*
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inSpec - The specification object or array
 * @returns {Object|Array|null} - The normalized specification
 */
export const normalizeSpec = ({ inSpec }) => {
    const localSpec = inSpec;

    if (localSpec === null || localSpec === undefined) return null;

    if (Array.isArray(localSpec)) {
        return localSpec.map((currentChild) => normalizeSpec({ inSpec: currentChild }));
    }

    if (typeof localSpec !== "object") return localSpec;

    const localClone = typeof structuredClone === "function"
        ? structuredClone(localSpec)
        : JSON.parse(JSON.stringify(localSpec));

    if (localClone.props && typeof localClone.props === "object") {
        const { className, textContent, dataset, ...restProps } = localClone.props;

        if (!localClone.attributes || typeof localClone.attributes !== "object") {
            localClone.attributes = {};
        }

        // 1. Map className -> attributes.class
        if (className !== undefined) {
            localClone.attributes.class = className;
        }

        // 2. Map textContent -> top-level textContent
        if (textContent !== undefined && localClone.textContent === undefined) {
            localClone.textContent = textContent;
        }

        // 3. Map dataset -> attributes['data-*']
        if (dataset && typeof dataset === "object") {
            for (const [dataKey, dataVal] of Object.entries(dataset)) {
                localClone.attributes[`data-${dataKey}`] = dataVal;
            }
        }

        // 4. Map remaining props (src, alt, href, id, title, type, etc.)
        for (const [propKey, propVal] of Object.entries(restProps)) {
            if (propVal !== undefined && typeof propVal !== "object") {
                localClone.attributes[propKey] = propVal;
            }
        }

        // Also assign properties object for DOM property access
        localClone.properties = {
            ...(localClone.properties || {}),
            ...restProps
        };
    }

    // Recursively normalize children
    if (Array.isArray(localClone.children)) {
        localClone.children = localClone.children.map((currentChild) =>
            normalizeSpec({ inSpec: currentChild })
        );
    }

    return localClone;
};

export default normalizeSpec;
