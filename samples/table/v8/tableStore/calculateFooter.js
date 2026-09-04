import { calculateRow } from "./calculateRow.js";

export const calculateFooter = ({ inData = [], inFooterConfig = [] } = {}) => {
    const localData = inData;
    const localFooterConfig = inFooterConfig;

    if (!Array.isArray(localFooterConfig)) return [];

    const localAccumulator = {};
    let localPreviousRow = null;
    const localComputedRows = [];

    localFooterConfig.forEach(rowConfig => {
        const computedRow = calculateRow({
            inRowConfig: rowConfig,
            inData: localData,
            inAccumulator: localAccumulator,
            inPreviousRow: localPreviousRow
        });

        if (rowConfig.name) {
            localAccumulator[rowConfig.name] = computedRow;
        }
        localPreviousRow = computedRow;
        localComputedRows.push(computedRow);
    });

    return localComputedRows;
};

export default calculateFooter;
