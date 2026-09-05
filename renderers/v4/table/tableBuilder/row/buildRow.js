export const buildRow = ({
    inCellTagName = "td",
    inCells = [],
    inRowClass = "",
    inCellClass = "px-4 py-3"
} = {}) => {
    const localCellTagName = inCellTagName;
    const localCells = inCells;
    const localRowClass = inRowClass;
    const localCellClass = inCellClass;

    return {
        tagName: "tr",
        attributes: localRowClass ? { class: localRowClass } : {},
        children: localCells.map(cell => {
            const textContent = typeof cell === "object" ? String(cell.textContent ?? "") : String(cell ?? "");
            const cellClass = typeof cell === "object" && cell.class ? cell.class : localCellClass;
            const alignClass = typeof cell === "object" && cell.align === "right" ? "text-right font-mono" : "";

            const attributes = { class: `${cellClass} ${alignClass}`.trim() };
            if (typeof cell === "object" && cell.id) {
                attributes.id = cell.id;
            }

            return {
                tagName: localCellTagName,
                textContent,
                attributes
            };
        })
    };
};

export default buildRow;
