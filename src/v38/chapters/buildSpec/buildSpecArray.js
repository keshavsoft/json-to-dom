import dispatchSpec from "./index.js";

export const buildSpecArray = ({ raka, inShowLog = false }) => {
    const localRaka = raka;
    const localShowLog = inShowLog;

    if (!Array.isArray(localRaka)) return [];

    return localRaka.map(item => dispatchSpec({
        raka: item,
        inShowLog: localShowLog
    })).flat().filter(Boolean);
};

export default buildSpecArray;
