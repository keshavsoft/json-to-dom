/**
 * HTML Specification Hierarchy Rules
 * Defines required parent tags for contextual elements and forbidden child tags.
 */

export const REQUIRED_PARENTS = {
    li: ["ul", "ol", "menu"],
    dt: ["dl"],
    dd: ["dl"],
    tr: ["table", "thead", "tbody", "tfoot"],
    th: ["tr"],
    td: ["tr"],
    thead: ["table"],
    tbody: ["table"],
    tfoot: ["table"],
    caption: ["table"],
    colgroup: ["table"],
    col: ["colgroup"],
    option: ["select", "optgroup", "datalist"],
    optgroup: ["select"],
    legend: ["fieldset"],
    summary: ["details"],
    source: ["video", "audio", "picture"],
    track: ["video", "audio"]
};

export const FORBIDDEN_DESCENDANTS = {
    a: ["a", "button"],
    button: ["button", "a", "input", "select", "textarea"]
};

export const checkHierarchy = ({ inTagName, inParentTag }) => {
    const localTagName = inTagName?.toLowerCase();
    const localParentTag = inParentTag?.toLowerCase();

    const errors = [];

    // 1. Check required parent
    if (localTagName && REQUIRED_PARENTS[localTagName]) {
        const allowedParents = REQUIRED_PARENTS[localTagName];
        if (localParentTag && !allowedParents.includes(localParentTag)) {
            errors.push(`HTML Hierarchy Violation: <${localTagName}> cannot be placed inside <${localParentTag}>. Required parent: [${allowedParents.join(", ")}].`);
        }
    }

    // 2. Check forbidden descendants
    if (localParentTag && FORBIDDEN_DESCENDANTS[localParentTag]) {
        const forbidden = FORBIDDEN_DESCENDANTS[localParentTag];
        if (forbidden.includes(localTagName)) {
            errors.push(`HTML Nesting Violation: Interactive element <${localTagName}> cannot be nested inside <${localParentTag}>.`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export default checkHierarchy;
