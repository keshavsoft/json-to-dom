/**
 * HTML Specification Void Elements Rules
 * Void elements have no closing tag and must not contain textContent or children.
 */

export const VOID_TAGS = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "source",
    "track",
    "wbr"
];

export const isVoidTag = ({ inTagName }) => {
    const localTagName = inTagName?.toLowerCase();
    return VOID_TAGS.includes(localTagName);
};

export const checkVoidRules = ({ inTagName, inSpec }) => {
    const localTagName = inTagName?.toLowerCase();
    const localSpec = inSpec;

    const errors = [];

    if (isVoidTag({ inTagName: localTagName })) {
        if (localSpec?.textContent !== undefined && localSpec?.textContent !== null && localSpec?.textContent !== "") {
            errors.push(`Void Element Violation: <${localTagName}> is a void tag and cannot have 'textContent'.`);
        }

        if (Array.isArray(localSpec?.children) && localSpec.children.length > 0) {
            errors.push(`Void Element Violation: <${localTagName}> is a void tag and cannot have 'children'.`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export default checkVoidRules;
