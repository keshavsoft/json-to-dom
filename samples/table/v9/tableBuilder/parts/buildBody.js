import { buildRow } from "../row/buildRow.js";

export const buildBody = ({ inColumns = [], inData = [] } = {}) => {
    const localColumns = inColumns;
    const localData = inData;

    if (!Array.isArray(localData) || localData.length === 0) {
        const emptyCell = {
            textContent: "No matching records found",
            class: "px-4 py-8 text-center text-slate-400 italic"
        };
        const emptyRow = {
            tagName: "tr",
            children: [{
                tagName: "td",
                textContent: "No matching records found",
                attributes: {
                    colspan: String(localColumns.length),
                    class: "px-4 py-8 text-center text-slate-400 italic"
                }
            }]
        };
        return {
            tagName: "tbody",
            attributes: { class: "divide-y divide-slate-100 bg-white" },
            children: [emptyRow]
        };
    }

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
