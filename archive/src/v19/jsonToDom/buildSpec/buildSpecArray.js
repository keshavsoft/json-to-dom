import dispatchSpec from "../orchestration/2.dispatchSpec.js";

export const buildSpecArray = ({ inSpec, inShowLog = false }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (!Array.isArray(localSpec)) return [];

    return localSpec.map(item => dispatchSpec({
        inSpec: item,
        inShowLog: localShowLog
    })).flat().filter(Boolean);
};

export default buildSpecArray;
