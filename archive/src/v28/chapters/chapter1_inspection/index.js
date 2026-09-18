/**
 * Chapter 1: Inspection & Standards
 * 
 * Houses W3C HTML standard definitions and the pre-flight specification validator.
 */
import validate from "./validate/index.js";
import standards from "./standards/index.js";

export const validateSpec = ({ spec } = {}) => {
    return validate({ inSpec: spec });
};

export {
    validate,
    standards,
    standards as data
};

export default {
    validate,
    validateSpec,
    standards,
    data: standards
};
