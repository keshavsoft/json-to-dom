import validate from "./validate/index.js";

export const inspect = (inArgs) => {
    const localArgs = inArgs;
    const isConfig = localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && ("spec" in localArgs || "inSpec" in localArgs);
    const localSpec = isConfig ? (localArgs.spec ?? localArgs.inSpec) : localArgs;
    const localValidate = isConfig ? Boolean(localArgs.validate ?? localArgs.inValidate ?? localArgs.debug) : false;
    const localShowLog = isConfig ? Boolean(localArgs.showLog ?? localArgs.inShowLog) : false;

    if (localValidate && localSpec) {
        const localReport = validate({ inSpec: localSpec });
        if (!localReport.isValid) {
            console.warn("[json-to-dom: validation error]", localReport.errors, localReport);
        } else if (localReport.warnings?.length > 0 && localShowLog) {
            console.warn("[json-to-dom: validation warning]", localReport.warnings);
        }
        return localReport;
    }
    return { isValid: true };
};

export default inspect;
