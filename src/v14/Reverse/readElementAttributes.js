import globalAllowedAttributes from "../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };

const BOOLEAN_ATTRIBUTES = new Set([
    "checked",
    "selected",
    "disabled",
    "readonly",
    "required",
    "multiple",
    "autofocus",
    "hidden",
    "novalidate"
]);

const isAttributeAllowed = ({ inAttributeName, inAllowedAttributes = [] } = {}) => {
    const localAttributeName = inAttributeName?.toLowerCase();
    const localAllowedAttributes = Array.isArray(inAllowedAttributes) ? inAllowedAttributes : [];

    if (!localAttributeName) return false;

    if (globalAllowedAttributes.attributes.includes(localAttributeName)) {
        return true;
    }

    if (globalAllowedAttributes.wildcardPrefixes?.some(prefix => localAttributeName.startsWith(prefix))) {
        return true;
    }

    return localAllowedAttributes.includes(localAttributeName);
};

export const readElementAttributes = ({ inElement, inAllowedAttributes = [] } = {}) => {
    const localElement = inElement;
    const localAllowedAttributes = inAllowedAttributes;

    if (!localElement?.attributes) return {};

    return Array.from(localElement.attributes).reduce((accumulator, currentAttribute) => {
        const attributeName = currentAttribute?.name?.toLowerCase();

        if (!isAttributeAllowed({ inAttributeName: attributeName, inAllowedAttributes: localAllowedAttributes })) {
            return accumulator;
        }

        if (BOOLEAN_ATTRIBUTES.has(attributeName)) {
            accumulator[attributeName] = true;
            return accumulator;
        }

        accumulator[attributeName] = currentAttribute.value ?? "";
        return accumulator;
    }, {});
};

export default readElementAttributes;
