import tags from "../../../../docs/tags/tags.json" with { type: "json" };
import globalAttributes from "../../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };

export const validateTag = ({ inSpec, spec } = {}) => {
    const localSpec = inSpec ?? spec;

    const localErrors = [];
    const localWarnings = [];

    if (!localSpec || typeof localSpec !== "object") {
        localErrors.push("Spec must be a non-null object");
        return { isValid: false, errors: localErrors, warnings: localWarnings };
    }

    if (Array.isArray(localSpec)) {
        localSpec.forEach((inChildSpec, index) => {
            const localChildReport = validateTag({ inSpec: inChildSpec });
            if (!localChildReport.isValid) {
                localErrors.push(...localChildReport.errors.map(err => `[${index}] ${err}`));
            }
            localWarnings.push(...localChildReport.warnings.map(warn => `[${index}] ${warn}`));
        });
        return { isValid: localErrors.length === 0, errors: localErrors, warnings: localWarnings };
    }

    const localTagName = localSpec.tagName?.toLowerCase();
    if (!localTagName || typeof localTagName !== "string") {
        localErrors.push("Missing or invalid 'tagName'");
        return { isValid: false, errors: localErrors, warnings: localWarnings };
    }

    const localTagDef = tags[localTagName];
    if (!localTagDef) {
        localWarnings.push(`Tag '<${localTagName}>' is not recognized in tags.json`);
    } else {
        if (localTagDef.allowsChildren === false && Array.isArray(localSpec.children) && localSpec.children.length > 0) {
            localErrors.push(`Void tag '<${localTagName}>' cannot have children`);
        }

        if (localTagDef.allowsTextContent === false && localSpec.textContent) {
            localWarnings.push(`Tag '<${localTagName}>' does not normally allow direct textContent`);
        }

        if (localSpec.attributes && typeof localSpec.attributes === "object") {
            const localAllowed = new Set([
                ...(globalAttributes.attributes || []),
                ...(localTagDef.allowedAttributes || [])
            ]);
            const localWildcards = globalAttributes.wildcardPrefixes || [];

            for (const localAttrName of Object.keys(localSpec.attributes)) {
                const isWildcard = localWildcards.some(prefix => localAttrName.startsWith(prefix));
                if (!localAllowed.has(localAttrName) && !isWildcard) {
                    localWarnings.push(`Attribute '${localAttrName}' is not recognized on '<${localTagName}>'`);
                }
            }
        }
    }

    if (Array.isArray(localSpec.children)) {
        localSpec.children.forEach((inChildSpec, index) => {
            const localChildReport = validateTag({ inSpec: inChildSpec });
            if (!localChildReport.isValid) {
                localErrors.push(...localChildReport.errors.map(err => `<${localTagName}>.children[${index}]: ${err}`));
            }
            localWarnings.push(...localChildReport.warnings.map(warn => `<${localTagName}>.children[${index}]: ${warn}`));
        });
    }

    return {
        isValid: localErrors.length === 0,
        errors: localErrors,
        warnings: localWarnings
    };
};

export default validateTag;
