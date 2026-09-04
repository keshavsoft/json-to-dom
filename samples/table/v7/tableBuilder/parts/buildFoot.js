import { buildRow } from "../row/buildRow.js";

export const buildFoot = ({ inColumns = [], inComputedFooter = {} } = {}) => {
    const localColumns = inColumns;
    const localComputedFooter = inComputedFooter;

    if (!localComputedFooter || Object.keys(localComputedFooter).length === 0) {
        return null;
    }

    const footCells = localColumns.map((col, idx) => {
        if (localComputedFooter[col.key] !== undefined) {
            const val = localComputedFooter[col.key];
            const textContent = typeof val === "number" ? val.toFixed(2) : String(val);
            return {
                textContent,
                align: col.align || "right",
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
