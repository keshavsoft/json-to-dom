import dispatchSpec from "./index.js";

export const buildSpecArray = ({ raka, inShowLog = false, poka }) => {
    const localRaka = raka;
    const localShowLog = inShowLog;
    const localPoka = poka;

    if (!Array.isArray(localRaka)) return [];

    return localRaka.map(item => dispatchSpec({
        raka: item,
        inShowLog: localShowLog, poka: localPoka
    })).flat().filter(Boolean);
};

export default buildSpecArray;
