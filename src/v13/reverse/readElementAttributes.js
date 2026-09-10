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

export const readElementAttributes = ({ inElement } = {}) => {
    const localElement = inElement;

    if (!localElement?.attributes) return {};

    return Array.from(localElement.attributes).reduce((accumulator, currentAttribute) => {
        const attributeName = currentAttribute?.name?.toLowerCase();

        if (!attributeName) return accumulator;

        if (BOOLEAN_ATTRIBUTES.has(attributeName)) {
            accumulator[attributeName] = true;
            return accumulator;
        }

        accumulator[attributeName] = currentAttribute.value ?? "";
        return accumulator;
    }, {});
};

export default readElementAttributes;
