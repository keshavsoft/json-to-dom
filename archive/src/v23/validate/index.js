/**
 * validate barrel — standalone validation function and validation suite
 * Clean public API: validate({ spec }) or validate(spec)
 * Sub-utilities: validate.validateSpec, validate.validateTag, validate.isAttributeAllowed, etc.
 */
import validateTag from "./validateTag.js";
import validateSpec from "./validateSpec.js";
import isAttributeAllowed from "./isAttributeAllowed.js";
import isTagValid from "./isTagValid.js";
import getTagDefinition from "./getTagDefinition.js";
import filterAttributes from "./filterAttributes.js";

export const validate = (inArgs) => {
    const localArgs = inArgs;
    const localSpec = (localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && ("spec" in localArgs || "inSpec" in localArgs))
        ? (localArgs.spec ?? localArgs.inSpec)
        : localArgs;

    return validateSpec({ inSpec: localSpec });
};

// Attach sub-methods to validate function
validate.validateSpec = validateSpec;
validate.validateTag = validateTag;
validate.isAttributeAllowed = isAttributeAllowed;
validate.isTagValid = isTagValid;
validate.getTagDefinition = getTagDefinition;
validate.filterAttributes = filterAttributes;

export {
    validateTag,
    validateSpec,
    isAttributeAllowed,
    isTagValid,
    getTagDefinition,
    filterAttributes
};

export default validate;
