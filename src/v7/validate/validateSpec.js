import tags from "../../../docs/tags/tags.json" with { type: "json" };

const ALLOWED_SPEC_KEYS = [
    "tagName",
    "textContent",
    "attributes",
    "classList",
    "events",
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

    // 1. Check for unknown top-level keys in the supplied article
    Object.keys(localSpec).forEach((key) => {
        if (!ALLOWED_SPEC_KEYS.includes(key)) {
            unknownKeys.push(key);
            warnings.push(`Unknown top-level key "${key}" in specification`);
        }
    });

    // 2. Validate tagName
    const localTagName = localSpec.tagName?.toLowerCase();
    if (!localTagName) {
        errors.push('Missing required "tagName" property');
        return {
            isValid: false,
            tagName: null,
            errors,
            warnings,
            unknownKeys,
            invalidAttributes
        };
    }

    const tagDef = tags[localTagName];
    if (!tagDef) {
        errors.push(`Tag <${localTagName}> is not recognized in tags.json`);
        return {
            isValid: false,
            tagName: localTagName,
            errors,
            warnings,
            unknownKeys,
            invalidAttributes
        };
    }

    // 3. Validate textContent allowance
    if (localSpec.textContent && !tagDef.allowsTextContent) {
        errors.push(`Tag <${localTagName}> does not allow textContent (allowsTextContent: false)`);
    }

    // 4. Validate children allowance
    if (Array.isArray(localSpec.children) && localSpec.children.length > 0 && !tagDef.allowsChildren) {
        errors.push(`Tag <${localTagName}> is a void element and does not allow children (allowsChildren: false)`);
    }

    // 5. Validate attributes allowance
    if (localSpec.attributes && typeof localSpec.attributes === "object") {
        const allowed = Array.isArray(tagDef.allowedAttributes) ? tagDef.allowedAttributes : [];
        Object.keys(localSpec.attributes).forEach((attrKey) => {
            if (!allowed.includes(attrKey)) {
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
