import dispatchSpec from "./index.js";

export const buildSpecArray = ({ inSpec, inShowLog = false, inOutput }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;
    const localOutput = inOutput;

    if (!Array.isArray(localSpec)) return [];

    return localSpec.map(item => dispatchSpec({
        inSpec: item,
        inShowLog: localShowLog, inOutput: localOutput
    })).flat().filter(Boolean);
};

export default buildSpecArray;
