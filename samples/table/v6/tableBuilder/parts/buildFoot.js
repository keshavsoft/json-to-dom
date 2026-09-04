import { buildRow } from "../row/buildRow.js";

export const buildFoot = ({ inColumns = [], inData = [] } = {}) => {
    const localColumns = inColumns;
    const localData = inData;

    if (!localData || localData.length === 0) return null;

    // Calculate sum for numeric amount column
    const totalAmount = localData.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

    const footCells = localColumns.map((col, idx) => {
        if (col.key === "amount") {
            return {
                textContent: totalAmount.toFixed(2),
                align: "right",
                class: "px-4 py-3 font-bold font-mono text-slate-900"
            };
        }
        if (idx === 0) {
            return {
                textContent: "Total",
                class: "px-4 py-3 font-bold uppercase text-[11px] text-slate-700"
            };
        }
        return {
            textContent: "",
            class: "px-4 py-3"
        };
    });

    const footRow = buildRow({
        inCellTagName: "td",
        inCells: footCells,
        inRowClass: "bg-slate-100/70 border-t-2 border-slate-300 font-semibold"
    });

    return {
        tagName: "tfoot",
        children: [footRow]
    };
};

export default buildFoot;
