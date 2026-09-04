import { sum } from "./aggregates/sum.js";
import { count } from "./aggregates/count.js";

const aggregateFunctions = {
    sum,
    count
};

export const calculateFooter = ({ inData = [], inFooterConfig = {} } = {}) => {
    const localData = inData;
    const localFooterConfig = inFooterConfig;

    if (!localFooterConfig || typeof localFooterConfig !== "object") return {};

    const computed = {};

    Object.entries(localFooterConfig).forEach(([colKey, aggType]) => {
        const fn = aggregateFunctions[aggType];
        if (typeof fn === "function") {
            computed[colKey] = fn({ inData: localData, inKey: colKey });
        }
    });

    return computed;
};

export default calculateFooter;
