import tags from "../../../../docs/tags/tags.json" with { type: "json" };
import globalAllowedAttributes from "../../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };
import checkHierarchy from "./rules/hierarchyRules.js";
import checkVoidRules from "./rules/voidRules.js";

const ALLOWED_SPEC_KEYS = [
    "tagName",
    "textContent",
    "attributes",
    "classList",
    "children",
    "properties"
];

const isAttributeAllowed = ({ inAttributeName, inAllowedAttributes = [] }) => {
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

/**
 * validateSpec - Multi-Layer Recursive Tree Validator (v2)
 * Inspects:
 * 1. Syntax & Shape
 * 2. Tag Existence & Void Element Rules
 * 3. Tag-specific & Global Attributes
 * 4. Tree Hierarchy & Parent-Child Nesting
 * 5. Full Recursive Child Tree with Breadcrumb Path Tracking
 */
export const validateSpec = ({ inSpec, inParentTag = null, inPath = "root" } = {}) => {
    const localSpec = inSpec;
    const localParentTag = inParentTag;
    const localPath = inPath;

    const errors = [];
    const warnings = [];
    const unknownKeys = [];
    const invalidAttributes = [];
    const hierarchyViolations = [];

    // 0. Handle array of specs at root
    if (Array.isArray(localSpec)) {
        localSpec.forEach((item, index) => {
            const childResult = validateSpec({
                inSpec: item,
                inParentTag: localParentTag,
                inPath: `${localPath}[${index}]`
            });
            errors.push(...childResult.errors);
            warnings.push(...childResult.warnings);
            unknownKeys.push(...childResult.unknownKeys);
            invalidAttributes.push(...childResult.invalidAttributes);
            hierarchyViolations.push(...childResult.hierarchyViolations);
        });

        return {
            isValid: errors.length === 0,
            path: localPath,
            tagName: "array",
            errors,
            warnings,
            unknownKeys,
            invalidAttributes,
            hierarchyViolations
        };
    }

    // 1. Validate Shape
    if (!localSpec || typeof localSpec !== "object") {
        return {
            isValid: false,
            path: localPath,
            tagName: null,
            errors: [`[${localPath}] Specification must be a non-null object`],
            warnings,
            unknownKeys,
            invalidAttributes,
            hierarchyViolations
        };
    }

    const localTagName = typeof localSpec.tagName === "string" ? localSpec.tagName.toLowerCase().trim() : null;

    // 2. Validate tagName Presence
    if (!localTagName) {
        errors.push(`[${localPath}] Missing or invalid 'tagName'`);
        return {
            isValid: false,
            path: localPath,
            tagName: null,
            errors,
            warnings,
            unknownKeys,
            invalidAttributes,
            hierarchyViolations
        };
    }

    const currentPath = `${localPath} > <${localTagName}>`;

    // 3. Validate Tag in Schema
    const tagDef = tags[localTagName];
    if (!tagDef) {
        errors.push(`[${currentPath}] Unknown or unsupported HTML tag: <${localTagName}>`);
        return {
            isValid: false,
            path: currentPath,
            tagName: localTagName,
            errors,
            warnings,
            unknownKeys,
            invalidAttributes,
            hierarchyViolations
        };
    }

    // 4. Detect Unknown Root Keys (Typo Guard)
    Object.keys(localSpec).forEach((key) => {
        if (!ALLOWED_SPEC_KEYS.includes(key)) {
            unknownKeys.push(key);
            warnings.push(`[${currentPath}] Unknown spec property key "${key}" will be ignored`);
        }
    });

    // 5. Layer 2: Check Void Rules
    const voidCheck = checkVoidRules({ inTagName: localTagName, inSpec: localSpec });
    if (!voidCheck.isValid) {
        voidCheck.errors.forEach(err => errors.push(`[${currentPath}] ${err}`));
    }

    // 6. Layer 3: Validate Attributes
    if (localSpec.attributes && typeof localSpec.attributes === "object") {
        const allowed = Array.isArray(tagDef.allowedAttributes) ? tagDef.allowedAttributes : [];
        Object.keys(localSpec.attributes).forEach((attrKey) => {
            if (!isAttributeAllowed({ inAttributeName: attrKey, inAllowedAttributes: allowed })) {
                invalidAttributes.push(attrKey);
                errors.push(`[${currentPath}] Attribute "${attrKey}" is not allowed on <${localTagName}>`);
            }
        });
    }

    // 7. Layer 4: Check Tree Hierarchy / Parent-Child Relationships
    const hierarchyCheck = checkHierarchy({ inTagName: localTagName, inParentTag: localParentTag });
    if (!hierarchyCheck.isValid) {
        hierarchyCheck.errors.forEach(err => {
            errors.push(`[${currentPath}] ${err}`);
            hierarchyViolations.push(err);
        });
    }

    // 8. Layer 5: Recursive Child Tree Validation
    if (Array.isArray(localSpec.children)) {
        localSpec.children.forEach((child, index) => {
            if (child && typeof child === "object") {
                const childResult = validateSpec({
                    inSpec: child,
                    inParentTag: localTagName,
                    inPath: `${currentPath}.children[${index}]`
                });
                errors.push(...childResult.errors);
                warnings.push(...childResult.warnings);
                unknownKeys.push(...childResult.unknownKeys);
                invalidAttributes.push(...childResult.invalidAttributes);
                hierarchyViolations.push(...childResult.hierarchyViolations);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        path: currentPath,
        tagName: localTagName,
        errors,
        warnings,
        unknownKeys,
        invalidAttributes,
        hierarchyViolations
    };
};

export default validateSpec;
