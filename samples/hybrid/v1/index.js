import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import tableConfig from "./table/config.json" with { type: "json" };
import { Table } from "../../../renderers/v3/table/Table.js";

import searchConfig from "./search/config.json" with { type: "json" };
import { Form } from "../../../renderers/v3/form/Form.js";

const startFunc = () => {
    // 1. Instantiate Table with clean public API
    const table = new Table({
        inData: data,
        inColumns: columns,
        inConfig: tableConfig,
        inTargetContainerId: "table-container"
    });

    const tableControlsTree = table.render();

    const form = new Form({
        inColumns: columns,
        inConfig: searchConfig,
        inTargetContainerId: "filter-container"
    });

    const fromForm = form.render();

    const formElement = fromForm.element;

    const buttons = formElement.querySelectorAll("button");

    buttons.forEach(button => {
        button.addEventListener("click", event => {
            const currentTarget = event.currentTarget;
            const closestRow = currentTarget.closest("div");
            const input = closestRow.querySelector("input");
            const name = input.getAttribute("name");
            const value = input.value;
            const query = {};
            query[name] = value;

            console.log("tableControlsTree : ", table.filterStateData({ inQuery: query }));
        });
    });

};

startFunc();
