import globalAllowedAttributes from "../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };

export const isAttributeAllowed = ({ inAttributeName, inAllowedAttributes = [] }) => {
    const localAttributeName = inAttributeName;
    const localAllowedAttributes = Array.isArray(inAllowedAttributes) ? inAllowedAttributes : [];

    if (!localAttributeName || typeof localAttributeName !== "string") return false;

    // 1. Check Global Allowed Attributes
    if (globalAllowedAttributes.attributes.includes(localAttributeName)) {
        return true;
    }

    // 2. Check Global Wildcard Prefixes (data-*, aria-*)
    if (globalAllowedAttributes.wildcardPrefixes?.some(prefix => localAttributeName.startsWith(prefix))) {
        return true;
    }

    // 3. Fallback to Tag-Specific Allowed Attributes
    return localAllowedAttributes.includes(localAttributeName);
};

export default isAttributeAllowed;
