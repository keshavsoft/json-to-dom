import dispatchSpec from "./buildSpec/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export const construct = ({ inRawSpec, inShowLog, inOutputType }) => {
    const localRawSpec = inRawSpec;
    const localShowLog = inShowLog;

    const { spec } = normalizeInput({ inSpec: localRawSpec, inShowLog: localShowLog });

    return dispatchSpec({ inSpec: spec, inShowLog: localShowLog, inOutputType });
};

export default construct;