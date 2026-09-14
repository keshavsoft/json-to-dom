import validate from "./validate/index.js";
import standards from "./standards/index.js";

export const inspect = (inArgs) => {
    const isConfig = inArgs && typeof inArgs === "object" && !Array.isArray(inArgs) && ("spec" in inArgs || "inSpec" in inArgs);
    const spec = isConfig ? (inArgs.spec ?? inArgs.inSpec) : inArgs;
    const shouldValidate = isConfig ? Boolean(inArgs.validate ?? inArgs.inValidate ?? inArgs.debug) : false;
    const showLog = isConfig ? Boolean(inArgs.showLog ?? inArgs.inShowLog) : false;

    if (shouldValidate && spec) {
        const report = validate({ inSpec: spec });
        if (!report.isValid) {
            console.warn("[json-to-dom: validation error]", report.errors, report);
        } else if (report.warnings?.length > 0 && showLog) {
            console.warn("[json-to-dom: validation warning]", report.warnings);
        }
        return report;
    }
    return { isValid: true };
};

export const validateSpec = ({ spec } = {}) => {
    return validate({ inSpec: spec });
};

export {
    validate,
    standards,
    standards as data
};

export default inspect;
