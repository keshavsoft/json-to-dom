import data from "./data.json" with { type: "json" };
import { generateTableSpec } from "./generateTableSpec.js";
import { renderTable } from "./renderTable.js";

const startFunc = () => {
    const tableSpec = generateTableSpec({ inData: data });
    renderTable({ inSpec: tableSpec, inTargetContainerId: "table-container" });
};

startFunc();
