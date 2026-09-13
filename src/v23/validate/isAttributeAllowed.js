import globalAllowedAttributes from "../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };

export const isAttributeAllowed = ({ inAttributeName, inAllowedAttributes = [] }) => {
    const localAttributeName = inAttributeName;
    const localAllowedAttributes = Array.isArray(inAllowedAttributes) ? inAllowedAttributes : [];

    if (!localAttributeName || typeof localAttributeName !== "string") return false;

    if (globalAllowedAttributes.attributes.includes(localAttributeName)) {
        return true;
    }

    if (globalAllowedAttributes.wildcardPrefixes?.some(prefix => localAttributeName.startsWith(prefix))) {
        return true;
    }

    return localAllowedAttributes.includes(localAttributeName);
};

export default isAttributeAllowed;
