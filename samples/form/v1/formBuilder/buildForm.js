import { buildField } from "./field/buildField.js";

export const buildForm = ({ inColumns = [] } = {}) => {
    const localColumns = inColumns;

    if (!Array.isArray(localColumns)) return { tagName: "div", children: [] };

    const fieldRows = localColumns.map(col => buildField({ inColumn: col }));

    return {
        tagName: "div",
        attributes: {
            class: "bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-1 max-w-2xl mx-auto"
        },
        children: fieldRows
    };
};

export default buildForm;
