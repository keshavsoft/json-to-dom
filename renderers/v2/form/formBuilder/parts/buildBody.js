import { buildField } from "../field/buildField.js";

export const buildBody = ({ inColumns = [] } = {}) => {
    const localColumns = inColumns;

    if (!Array.isArray(localColumns)) return { tagName: "div", children: [] };

    const fieldRows = localColumns.map(col => buildField({ inColumn: col }));

    return {
        tagName: "div",
        attributes: {
            class: "space-y-1 py-1"
        },
        children: fieldRows
    };
};

export default buildBody;
