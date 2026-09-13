/**
 * validate — Versioned Validation Ecosystem (v25)
 * Exposes:
 * - validate: default active validation function (v2 multi-layer tree validator)
 * - validate.v1: baseline tag & attribute validation suite
 * - validate.v2: advanced multi-layer tree & hierarchy validation suite
 */
import v1 from "./v1/index.js";
import v2 from "./v2/index.js";

export const validate = (inArgs) => {
    // Default to v2 multi-layer tree validator
    return v2(inArgs);
};

// Expose versioned suites
validate.v1 = v1;
validate.v2 = v2;

// Re-export sub-methods from current active version (v2)
validate.validateSpec = v2.validateSpec;
validate.checkHierarchy = v2.checkHierarchy;
validate.checkVoidRules = v2.checkVoidRules;
validate.isVoidTag = v2.isVoidTag;

export {
    v1,
    v2
};

export default validate;
