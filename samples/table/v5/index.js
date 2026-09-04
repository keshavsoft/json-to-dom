import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import { buildTable } from "./buildTable.js";
import { renderTable } from "./renderTable.js";

const startFunc = () => {
    const tableSpec = buildTable({ inColumns: columns, inData: data });
    renderTable({ inSpec: tableSpec, inTargetContainerId: "table-container" });
};

startFunc();
