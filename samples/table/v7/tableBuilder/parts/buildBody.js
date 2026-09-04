import { buildRow } from "../row/buildRow.js";

export const buildBody = ({ inColumns = [], inData = [] } = {}) => {
    const localColumns = inColumns;
    const localData = inData;

    const bodyRows = localData.map((row, idx) => {
        const cells = localColumns.map(col => ({
            textContent: col.key === "amount" ? Number(row[col.key]).toFixed(2) : String(row[col.key] ?? ""),
            align: col.align
        }));

        return buildRow({
            inCellTagName: "td",
            inCells: cells,
            inRowClass: idx % 2 === 0 ? "hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-50",
            inCellClass: "px-4 py-3"
        });
    });

    return {
        tagName: "tbody",
        attributes: { class: "divide-y divide-slate-100 bg-white" },
        children: bodyRows
    };
};

export default buildBody;
