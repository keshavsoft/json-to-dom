import { refreshTable } from "../repaints/refreshTable.js";

export const filterTable = ({ inTable, inQuery = "", query = "" } = {}) => {
    const localTable = inTable;
    const localQuery = inQuery || query;

    if (!localTable?.tableElement || !localTable?.store) return;

    localTable.store.filter({ inQuery: localQuery });

    refreshTable({
        inTableElement: localTable.tableElement,
        inStore: localTable.store
    });
};

export default filterTable;
