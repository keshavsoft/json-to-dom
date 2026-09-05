import { buildRow } from "../row/buildRow.js";

export const buildBody = ({ inColumns = [], inData = [], inRowConfig = {} } = {}) => {
    const localColumns = inColumns;
    const localData = inData;
    const localRowConfig = inRowConfig;

    if (!Array.isArray(localData) || localData.length === 0) {
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

    const isStriped = localRowConfig?.striped !== false;
    const isHover = localRowConfig?.hover !== false;

    const bodyRows = localData.map((row, idx) => {
        const cells = localColumns.map(col => ({
            textContent: col.key === "amount" ? Number(row[col.key]).toFixed(2) : String(row[col.key] ?? ""),
            align: col.align
        }));

        let rowClass = "";
        if (isStriped && idx % 2 !== 0) rowClass += "bg-slate-50/50 ";
        if (isHover) rowClass += "hover:bg-slate-50 ";

        return buildRow({
            inCellTagName: "td",
            inCells: cells,
            inRowClass: rowClass.trim(),
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
