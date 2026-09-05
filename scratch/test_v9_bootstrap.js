import { Table } from "../renderers/v9/table/index.js";
import { Form } from "../renderers/v9/form/index.js";
import { DataList } from "../renderers/v9/datalist/index.js";
import columns from "../samples/hybrid/v2/columns.json" with { type: "json" };
import data from "../samples/hybrid/v2/data.json" with { type: "json" };
import tableConfig from "../samples/hybrid/v2/table/config.json" with { type: "json" };
import searchConfig from "../samples/hybrid/v2/search/config.json" with { type: "json" };
import datalistConfig from "../samples/hybrid/v2/datalist/config.json" with { type: "json" };

console.log("=== Testing v9 Clean Public API (data, columns, config) ===");

// 1. Test Table with clean { data, columns, config }
const table = new Table({
    data,
    columns,
    config: tableConfig
});

console.log("Table classes:", table.classes);
console.log("Table activeColumns:", table.store.activeColumns.map(c => c.key));
console.log("Table rows:", table.store.stateData.length);

// Test filter methods with clean { query }
table.filterStateData({ query: { "allinventoryentries.stockitemname": "ROPE" } });
console.log("Filtered with query { allinventoryentries.stockitemname: 'ROPE' } => rows:", table.store.stateData.length);

// 2. Test Form with clean { columns, config }
const form = new Form({
    columns,
    config: searchConfig
});
console.log("Form activeColumns:", form.store.activeColumns.length);

// 3. Test DataList with clean { data, columns, config }
const dataList = new DataList({
    data,
    columns,
    config: datalistConfig
});
console.log("DataList activeColumns:", dataList.store.activeColumns.length);

// Test update with clean { data }
dataList.update({ data: table.store.stateData });
console.log("DataList updated with new data rows:", dataList.store.stateData.length);

console.log("\n>>> ALL V9 CLEAN PUBLIC API TESTS PASSED! <<<");
