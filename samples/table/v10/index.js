import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import config from "./config.json" with { type: "json" };
import { Table } from "./table/Table.js";

const startFunc = () => {
    // 1. Instantiate Table with clean public API
    const table = new Table({
        data,
        columns,
        config,
        targetContainerId: "table-container"
    });

    table.render();

    // 2. Hook up static search input
    const searchInput = document.getElementById("SearchInputId");
    if (searchInput) {
        searchInput.addEventListener("input", event => {
            table.filter({ query: event.target.value });
        });
    }
};

startFunc();
