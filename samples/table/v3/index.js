import spec from "./spec.json" with { type: "json" };
import { renderTable } from "./renderTable.js";

const startFunc = () => {
    const tableSpec = spec;
    renderTable({ inSpec: tableSpec, inTargetContainerId: "table-container" });
};

startFunc();
