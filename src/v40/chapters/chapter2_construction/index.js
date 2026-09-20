import dispatchSpec from "../buildSpec/index.js";
import normalizeInput from "./orchestration/1.normalizeInput.js";

export const construct = ({ raka, inShowLog, poka }) => {
    const localShowLog = inShowLog;

    // const { spec } = normalizeInput({ inSpec: localRawSpec, inShowLog: localShowLog });

    return dispatchSpec({ raka, inShowLog: localShowLog, poka });
};

export default construct;