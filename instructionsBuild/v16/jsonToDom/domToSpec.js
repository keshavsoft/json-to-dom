const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;

/**
 * Reverses a DOM node tree back into a clean specification object.
 * 
 * @param {Object} inArgs
 * @param {Node} inArgs.inNode - The DOM node to reverse
 * @param {boolean} [inArgs.inCollapseWhitespace=true] - Whether to collapse whitespace in text
 * @returns {Object|Array|string|null}
 */
export const domToSpec = ({ inNode, inCollapseWhitespace = true } = {}) => {
    const localNode = inNode;
    const localCollapseWhitespace = inCollapseWhitespace;

    if (!localNode) return null;

    if (localNode.nodeType === COMMENT_NODE) return null;

    if (localNode.nodeType === TEXT_NODE) {
        const text = localNode.textContent || "";
        const processed = localCollapseWhitespace ? text.replace(/\s+/g, " ").trim() : text;
        return processed.length > 0 ? processed : null;
    }

    if (localNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
        return Array.from(localNode.childNodes || [])
            .map((currentChildNode) => domToSpec({
                inNode: currentChildNode,
                inCollapseWhitespace: localCollapseWhitespace
            }))
            .filter((currentChildSpec) => currentChildSpec !== null);
    }

    if (localNode.nodeType !== ELEMENT_NODE) return null;

    const localTagName = localNode.tagName?.toLowerCase();
    if (!localTagName) return null;

    const spec = {
        tagName: localTagName
    };

    // Extract attributes
    const attributes = {};
    if (localNode.className) {
        attributes.class = localNode.className;
    }

    if (localNode.attributes) {
        for (const currentAttr of Array.from(localNode.attributes)) {
            const attrName = currentAttr.name.toLowerCase();
            if (attrName === "class") continue;
            attributes[attrName] = currentAttr.value;
        }
    }

    if (Object.keys(attributes).length > 0) {
        spec.attributes = attributes;
    }

    if (localTagName === "textarea") {
        const textareaText = "value" in localNode ? localNode.value : localNode.textContent;
        const normalized = localCollapseWhitespace ? (textareaText || "").replace(/\s+/g, " ").trim() : textareaText;
        if (normalized) {
            spec.textContent = normalized;
        }
        return spec;
    }

    const childNodes = Array.from(localNode.childNodes || []);
    const childSpecs = childNodes
        .map((currentChildNode) => domToSpec({
            inNode: currentChildNode,
            inCollapseWhitespace: localCollapseWhitespace
        }))
        .filter((currentChildSpec) => currentChildSpec !== null);

    if (childSpecs.length === 1 && typeof childSpecs[0] === "string") {
        spec.textContent = childSpecs[0];
        return spec;
    }

    if (childSpecs.length > 0) {
        spec.children = childSpecs;
    }

    return spec;
};

export default domToSpec;
