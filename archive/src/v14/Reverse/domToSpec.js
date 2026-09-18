import tags from "../../../docs/tags/tags.json" with { type: "json" };
import normalizeText from "./normalizeText.js";
import readElementAttributes from "./readElementAttributes.js";

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;

const buildNodeSpec = ({ inNode, inCollapseWhitespace = true } = {}) => {
    const localNode = inNode;
    const localCollapseWhitespace = inCollapseWhitespace;

    if (!localNode) return null;

    if (localNode.nodeType === COMMENT_NODE) return null;

    if (localNode.nodeType === TEXT_NODE) {
        return normalizeText({
            inText: localNode.textContent,
            inCollapseWhitespace: localCollapseWhitespace
        });
    }

    if (localNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
        return Array.from(localNode.childNodes || [])
            .map((currentChildNode) => buildNodeSpec({
                inNode: currentChildNode,
                inCollapseWhitespace: localCollapseWhitespace
            }))
            .filter((currentChildSpec) => currentChildSpec !== null);
    }

    if (localNode.nodeType !== ELEMENT_NODE) return null;

    const localTagName = localNode.tagName?.toLowerCase();
    if (!localTagName) return null;

    const localTagDefinition = tags[localTagName] || null;
    const allowsTextContent = localTagDefinition ? localTagDefinition.allowsTextContent !== false : true;
    const allowsChildren = localTagDefinition ? localTagDefinition.allowsChildren !== false : true;

    const spec = {
        tagName: localTagName
    };

    const elementAttributes = readElementAttributes({
        inElement: localNode,
        inAllowedAttributes: localTagDefinition?.allowedAttributes
    });

    if (Object.keys(elementAttributes).length > 0) {
        spec.attributes = elementAttributes;
    }

    if (localTagName === "textarea") {
        const textareaText = normalizeText({
            inText: "value" in localNode ? localNode.value : localNode.textContent,
            inCollapseWhitespace: localCollapseWhitespace
        });

        if (textareaText !== null && allowsTextContent) {
            spec.textContent = textareaText;
        }

        return spec;
    }

    const childSpecs = Array.from(localNode.childNodes || [])
        .map((currentChildNode) => buildNodeSpec({
            inNode: currentChildNode,
            inCollapseWhitespace: localCollapseWhitespace
        }))
        .filter((currentChildSpec) => currentChildSpec !== null);

    if (childSpecs.length === 1 && typeof childSpecs[0] === "string" && allowsTextContent) {
        spec.textContent = childSpecs[0];
        return spec;
    }

    if (childSpecs.length > 0 && allowsChildren) {
        spec.children = childSpecs;
    }

    return spec;
};

export const domToSpec = ({ inNode, inCollapseWhitespace = true } = {}) => {
    return buildNodeSpec({
        inNode,
        inCollapseWhitespace
    });
};

export default domToSpec;
