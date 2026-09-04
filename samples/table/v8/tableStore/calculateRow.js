import { sum } from "./aggregates/sum.js";
import { count } from "./aggregates/count.js";
import { percent } from "./evaluations/percent.js";
import { add } from "./evaluations/add.js";
import { multiply } from "./evaluations/multiply.js";

const aggregateFunctions = {
    sum,
    count
};

const evalFunctions = {
    percent,
    add,
    multiply
};

export const calculateRow = ({ inRowConfig = {}, inData = [], inAccumulator = {}, inPreviousRow = null } = {}) => {
    const localRowConfig = inRowConfig;
    const localData = inData;
    const localAccumulator = inAccumulator;
    const localPreviousRow = inPreviousRow;

    const rowName = localRowConfig.name || "";
    const rowTitle = localRowConfig.title || "";
    const rowType = localRowConfig.type || "aggregate";
    const valuesConfig = localRowConfig.values || {};
    const computedValues = {};

    if (rowType === "aggregate") {
        Object.entries(valuesConfig).forEach(([colKey, aggType]) => {
            const aggFn = aggregateFunctions[aggType];
            if (typeof aggFn === "function") {
                computedValues[colKey] = aggFn({ inData: localData, inKey: colKey });
            }
        });
    } else if (rowType === "eval") {
        Object.entries(valuesConfig).forEach(([colKey, rule]) => {
            if (typeof rule === "object" && rule !== null) {
                const op = rule.operation;
                const evalFn = evalFunctions[op];

                if (typeof evalFn === "function") {
                    if (op === "percent") {
                        const targetRowName = rule.source || localRowConfig.dependsOn;
                        const sourceRow = localAccumulator[targetRowName] || localPreviousRow;
                        const sourceVal = sourceRow?.values?.[colKey] ?? 0;
                        computedValues[colKey] = evalFn({ inValue: sourceVal, inRate: rule.rate });
                    } else if (op === "add") {
                        const sourceNames = rule.sources || (Array.isArray(localRowConfig.dependsOn) ? localRowConfig.dependsOn : [localRowConfig.dependsOn]);
                        const inValues = sourceNames.map(name => localAccumulator[name]?.values?.[colKey] ?? 0);
                        computedValues[colKey] = evalFn({ inValues });
                    } else if (op === "multiply") {
                        const targetRowName = rule.source || localRowConfig.dependsOn;
                        const sourceRow = localAccumulator[targetRowName] || localPreviousRow;
                        const sourceVal = sourceRow?.values?.[colKey] ?? 0;
                        computedValues[colKey] = evalFn({ inValue: sourceVal, inFactor: rule.factor });
                    }
                }
            }
        });
    }

    return {
        name: rowName,
        title: rowTitle,
        values: computedValues
    };
};

export default calculateRow;
