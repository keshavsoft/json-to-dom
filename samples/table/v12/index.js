import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import config from "./config.json" with { type: "json" };
import { Table } from "../../../renderers/v3/table/Table.js";

const startFunc = () => {
    // 1. Instantiate Table with clean public API
    const table = new Table({
        inData: data,
        inColumns: columns,
        inConfig: config,
        inTargetContainerId: "table-container"
    });

    const controlsTree = table.render();

    console.log("Controls Tree with IDs:", controlsTree);

    // 2. Hook up static search input
    const searchInput = document.getElementById("SearchInputId");
    if (searchInput) {
        searchInput.addEventListener("input", event => {
            table.filter({ inQuery: event.target.value });
        });
    }
};

startFunc();
