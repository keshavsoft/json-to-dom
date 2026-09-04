import { buildRow } from "./buildRow.js";

export const buildTable = ({ inColumns = [], inData = [] } = {}) => {
    const localColumns = inColumns;
    const localData = inData;

    // 1. Build Header Row using buildRow
    const headerCells = localColumns.map(col => ({
        textContent: col.label,
        align: col.align
    }));

    const headerRow = buildRow({
        inCellTagName: "th",
        inCells: headerCells,
        inCellClass: "px-4 py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider"
    });

    const theadSpec = {
        tagName: "thead",
        attributes: { class: "bg-slate-100" },
        children: [headerRow]
    };

    // 2. Build Data Rows using buildRow
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

    const tbodySpec = {
        tagName: "tbody",
        attributes: { class: "divide-y divide-slate-100 bg-white" },
        children: bodyRows
    };

    // 3. Assemble Table Spec
    return {
        tagName: "table",
        attributes: {
            class: "w-full text-left text-xs text-slate-700 divide-y divide-slate-200"
        },
        children: [theadSpec, tbodySpec]
    };
};

export default buildTable;
