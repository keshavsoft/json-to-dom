import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import tableConfig from "./table/config.json" with { type: "json" };
import { Table } from "../../../renderers/v9/table/index.js";

import searchConfig from "./search/config.json" with { type: "json" };
import { Form } from "../../../renderers/v9/form/index.js";

import datalistConfig from "./datalist/config.json" with { type: "json" };
import { DataList } from "../../../renderers/v9/datalist/index.js";

const startFunc = () => {
    // 1. Instantiate Table with clean public API
    const table = new Table({
        data,
        columns,
        config: tableConfig,
        targetContainerId: "table-container"
    });

    const tableControlsTree = table.render();

    // 2. Instantiate and render Form with config-driven activeColumns
    const form = new Form({
        columns,
        config: searchConfig,
        targetContainerId: "filter-container"
    });

    const fromForm = form.render();

    // 3. Instantiate and render DataList with its own independent config
    const dataList = new DataList({
        data,
        columns,
        config: datalistConfig,
        targetContainerId: "datalist-container"
    });

    dataList.render();

    console.log("dataList : ", dataList);

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

            table.filterStateData({ query });

            // Update datalist autocomplete options with new filtered state counts
            dataList.update({ data: table.store.stateData });
        });
    });
};

startFunc();
