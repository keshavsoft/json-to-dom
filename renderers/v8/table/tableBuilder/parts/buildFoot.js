import { buildRow } from "../row/buildRow.js";

export const buildFoot = ({ inColumns = [], inComputedFooter = [] } = {}) => {
    const localColumns = inColumns;
    const localComputedFooter = inComputedFooter;

    if (!Array.isArray(localComputedFooter) || localComputedFooter.length === 0) {
        return null;
    }

    const footRows = localComputedFooter.map((computedRow, rowIndex) => {
        const rowTitle = computedRow.title || "";
        const rowValues = computedRow.values || {};
        const isLastRow = rowIndex === localComputedFooter.length - 1;

        const titleColIndex = localColumns.findIndex(c => !c.isSerial);

        const cells = localColumns.map((col, colIndex) => {
            if (rowValues[col.key] !== undefined) {
                const val = rowValues[col.key];
                const textContent = typeof val === "number" ? val.toFixed(2) : String(val);
                const cellClass = isLastRow
                    ? "px-4 py-3 font-bold font-mono text-slate-950"
                    : "px-4 py-2.5 font-semibold font-mono text-slate-800";

                return {
                    textContent,
                    align: col.align || "right",
                    class: cellClass
                };
            }

            if (colIndex === titleColIndex) {
                const titleClass = isLastRow
                    ? "px-4 py-3 font-bold uppercase text-[11px] text-slate-900 tracking-wider"
                    : "px-4 py-2.5 font-semibold uppercase text-[11px] text-slate-600 tracking-wider";

                return {
                    textContent: rowTitle,
                    class: titleClass
                };
            }

            return {
                textContent: "",
                class: isLastRow ? "px-4 py-3" : "px-4 py-2.5"
            };
        });

        const rowClass = isLastRow
            ? "bg-slate-100/90 border-t-2 border-slate-300 font-bold text-slate-900"
            : "bg-slate-50/70 border-t border-slate-200 text-slate-700";

        return buildRow({
            inCellTagName: "td",
            inCells: cells,
            inRowClass: rowClass
        });
    });

    return {
        tagName: "tfoot",
        children: footRows
    };
};

export default buildFoot;
