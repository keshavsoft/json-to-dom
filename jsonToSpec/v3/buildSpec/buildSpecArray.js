import dispatchSpec from "./index.js";

export const buildSpecArray = ({ inArray = [], inShowLog = false, inDataJson }) => {
    const localArray = inArray;
    const localShowLog = inShowLog;
    const localDataJson = inDataJson;

    if (!Array.isArray(localArray)) return [];

    return localArray.map(item => dispatchSpec({
        inSpecJson: item,
        inShowLog: localShowLog, inDataJson: localDataJson
    })).flat().filter(Boolean);
};

export default buildSpecArray;
