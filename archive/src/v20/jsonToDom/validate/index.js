/**
 * validate barrel — public validation API grouped as one object
 */
import validateTag from "./validateTag.js";
import validateSpec from "./validateSpec.js";
import isAttributeAllowed from "./isAttributeAllowed.js";

export const validate = {
    validateTag,
    validateSpec,
    isAttributeAllowed
};

export default validate;
