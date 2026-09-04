import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import footerConfig from "./footer.json" with { type: "json" };
import { Table } from "./table/Table.js";

const startFunc = () => {
    // 1. Create and render Table instance
    const table = new Table({
        inColumns: columns,
        inData: data,
        inFooterConfig: footerConfig,
        inTargetContainerId: "table-container"
    });

    table.render();

    // 2. Hook listener to static search input in DOM
    const searchInput = document.getElementById("SearchInputId");
    if (searchInput) {
        searchInput.addEventListener("input", event => {
            table.filter({ inQuery: event.target.value });
        });
    }
};

startFunc();
