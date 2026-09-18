import dispatchSpec from "./index.js";

export const buildSpecArray = ({ inSpec, inShowLog = false, inOutputType }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;

    if (!Array.isArray(localSpec)) return [];

    return localSpec.map(item => dispatchSpec({
        inSpec: item,
        inShowLog: localShowLog, inOutputType
    })).flat().filter(Boolean);
};

export default buildSpecArray;
