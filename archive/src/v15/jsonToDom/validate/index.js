/**
 * validate barrel — public validation API grouped as one object
 */
import validateTag from "./validateTag.js";
import validateSpec from "./validateSpec.js";
import isAttributeAllowed from "./isAttributeAllowed.js";
import isEventAllowed from "./isEventAllowed.js";

export const validate = {
    validateTag,
    validateSpec,
    isAttributeAllowed,
    isEventAllowed
};

export default validate;
