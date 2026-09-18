import tags from "../../../../docs/tags/tags.json" with { type: "json" };
import isAttributeAllowed from "./isAttributeAllowed.js";

const ALLOWED_SPEC_KEYS = [
    "tagName",
    "textContent",
    "attributes",
    "classList",
    "children",
    "properties"
];

export const validateSpec = ({ inSpec }) => {
    const localSpec = inSpec;

    const errors = [];
    const warnings = [];
    const unknownKeys = [];
    const invalidAttributes = [];

    if (!localSpec || typeof localSpec !== "object" || Array.isArray(localSpec)) {
        return {
            isValid: false,
            tagName: null,
            errors: ["Specification must be a non-null object"],
            warnings,
            unknownKeys,
            invalidAttributes
        };
    }

    const localTagName = typeof localSpec.tagName === "string" ? localSpec.tagName.toLowerCase().trim() : null;

    // 1. Validate tagName presence
    if (!localTagName) {
        errors.push("Missing or invalid 'tagName'");
        return {
            isValid: false,
            tagName: null,
            errors,
            warnings,
            unknownKeys,
            invalidAttributes
        };
    }

    // 2. Validate tag existence in schema
    const tagDef = tags[localTagName];
    if (!tagDef) {
        errors.push(`Unknown or unsupported HTML tag: <${localTagName}>`);
        return {
            isValid: false,
            tagName: localTagName,
            errors,
            warnings,
            unknownKeys,
            invalidAttributes
        };
    }

    // 3. Detect unknown root keys
    Object.keys(localSpec).forEach((key) => {
        if (!ALLOWED_SPEC_KEYS.includes(key)) {
            unknownKeys.push(key);
            warnings.push(`Unknown property key "${key}" will be ignored`);
        }
    });

    // 4. Validate textContent vs void/children restrictions
    if (localSpec.textContent !== undefined && localSpec.textContent !== null && !tagDef.allowsTextContent) {
        errors.push(`Tag <${localTagName}> does not allow direct textContent (allowsTextContent: false)`);
    }

    if (Array.isArray(localSpec.children) && localSpec.children.length > 0 && !tagDef.allowsChildren) {
        errors.push(`Tag <${localTagName}> is a void element and does not allow children (allowsChildren: false)`);
    }

    // 5. Validate attributes allowance
    if (localSpec.attributes && typeof localSpec.attributes === "object") {
        const allowed = Array.isArray(tagDef.allowedAttributes) ? tagDef.allowedAttributes : [];
        Object.keys(localSpec.attributes).forEach((attrKey) => {
            if (!isAttributeAllowed({ inAttributeName: attrKey, inAllowedAttributes: allowed })) {
                invalidAttributes.push(attrKey);
                errors.push(`Attribute "${attrKey}" is not allowed on <${localTagName}>`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        tagName: localTagName,
        errors,
        warnings,
        unknownKeys,
        invalidAttributes
    };
};

export default validateSpec;
