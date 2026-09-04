import { buildHead } from "./parts/buildHead.js";
import { buildBody } from "./parts/buildBody.js";
import { buildFoot } from "./parts/buildFoot.js";

export const buildTable = ({ inColumns = [], inData = [], inComputedFooter = [] } = {}) => {
    const localColumns = inColumns;
    const localData = inData;
    const localComputedFooter = inComputedFooter;

    const thead = buildHead({ inColumns: localColumns });
    const tbody = buildBody({ inColumns: localColumns, inData: localData });
    const tfoot = buildFoot({ inColumns: localColumns, inComputedFooter: localComputedFooter });

    return {
        tagName: "table",
        attributes: {
            class: "w-full text-left text-xs text-slate-700 divide-y divide-slate-200"
        },
        children: [thead, tbody, tfoot].filter(Boolean)
    };
};

export default buildTable;
