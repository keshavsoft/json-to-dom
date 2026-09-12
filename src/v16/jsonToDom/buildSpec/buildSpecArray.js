import buildSpecElement from "../index.js";

export const buildSpecArray = ({ inSpec, inApplyEvents = true, inShowLog = false }) => {
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!Array.isArray(localSpec)) return [];

    return localSpec.map(item => buildSpecElement({
        inSpec: item,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    })).flat().filter(Boolean);
};

export default buildSpecArray;
