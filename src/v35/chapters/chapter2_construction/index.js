import dispatchSpec from "./buildSpec/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export const construct = ({ inRawSpec, inShowLog, inOutput }) => {
    const localRawSpec = inRawSpec;
    const localShowLog = inShowLog;

    const { spec } = normalizeInput({ inSpec: localRawSpec, inShowLog: localShowLog });

    return dispatchSpec({ inSpec: spec, inShowLog: localShowLog, inOutput });
};

export default construct;