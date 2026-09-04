import { buildRow } from "../row/buildRow.js";

export const buildHead = ({ inColumns = [] } = {}) => {
    const localColumns = inColumns;

    const headerCells = localColumns.map(col => ({
        textContent: col.label,
        align: col.align
    }));

    const headerRow = buildRow({
        inCellTagName: "th",
        inCells: headerCells,
        inCellClass: "px-4 py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider"
    });

    return {
        tagName: "thead",
        attributes: { class: "bg-slate-100" },
        children: [headerRow]
    };
};

export default buildHead;
