/**
 * validate v2 — Advanced Multi-Layer Tree & Hierarchy Validation Suite
 * Clean public API: validate({ spec }) or validate(spec)
 */
import validateSpec from "./validateSpec.js";
import checkHierarchy from "./rules/hierarchyRules.js";
import checkVoidRules, { isVoidTag, VOID_TAGS } from "./rules/voidRules.js";

export const validate = (inArgs) => {
    const localArgs = inArgs;
    const localSpec = (localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && ("spec" in localArgs || "inSpec" in localArgs))
        ? (localArgs.spec ?? localArgs.inSpec)
        : localArgs;

    return validateSpec({ inSpec: localSpec });
};

// Attach sub-methods
validate.validateSpec = validateSpec;
validate.checkHierarchy = checkHierarchy;
validate.checkVoidRules = checkVoidRules;
validate.isVoidTag = isVoidTag;
validate.VOID_TAGS = VOID_TAGS;

export {
    validateSpec,
    checkHierarchy,
    checkVoidRules,
    isVoidTag,
    VOID_TAGS
};

export default validate;
