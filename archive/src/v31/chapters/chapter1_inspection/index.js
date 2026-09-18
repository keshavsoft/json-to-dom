import validateTag from "./validateTag.js";
import { guardTags } from "./standards/index.js";

export const inspect = (inArgs) => {
    const localArgs = inArgs;
    const isConfig = localArgs && typeof localArgs === "object" && !Array.isArray(localArgs) && ("spec" in localArgs || "inSpec" in localArgs);
    const localSpec = isConfig ? (localArgs.inSpec ?? localArgs.spec) : localArgs;
    const localValidate = isConfig ? Boolean(localArgs.inValidate ?? localArgs.validate ?? localArgs.debug) : false;
    const localShowLog = isConfig ? Boolean(localArgs.inShowLog ?? localArgs.showLog) : false;

    if (localValidate && localSpec) {
        const localReport = validateTag({ inSpec: localSpec });
        if (!localReport.isValid) {
            console.warn("[json-to-dom: validation error]", localReport.errors, localReport);
        } else if (localReport.warnings?.length > 0 && localShowLog) {
            console.warn("[json-to-dom: validation warning]", localReport.warnings);
        }
        return localReport;
    }
    return { isValid: true };
};

export {
    validateTag,
    guardTags
};

export default inspect;
