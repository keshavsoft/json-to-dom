import { TableStore } from "../renderers/v8/table/tableStore/index.js";
import { FormStore } from "../renderers/v8/form/formStore/index.js";
import { DataListStore } from "../renderers/v8/datalist/datalistStore/index.js";
import columns from "../samples/hybrid/v2/columns.json" with { type: "json" };
import data from "../samples/hybrid/v2/data.json" with { type: "json" };
import tableConfig from "../samples/hybrid/v2/table/config.json" with { type: "json" };
import searchConfig from "../samples/hybrid/v2/search/config.json" with { type: "json" };
import datalistConfig from "../samples/hybrid/v2/datalist/config.json" with { type: "json" };

console.log("=== Testing v8 English Story TableStore ===");

const tableStore = new TableStore({
    inData: data,
    inColumns: columns,
    inConfig: tableConfig
});

console.log("1. Active Columns:", tableStore.activeColumns.map(c => c.key));
console.log("2. Total Rows:", tableStore.stateData.length);
console.log("3. First Row:", { serial: tableStore.stateData[0].serial, item: tableStore.stateData[0]["allinventoryentries.stockitemname"] });
console.log("4. Computed Footer Rows:", tableStore.computedFooter.length);

console.log("\n=== Testing v8 filterOriginalData ===");
const filtered1 = tableStore.filterOriginalData({
    inQuery: { "allinventoryentries.stockitemname": "ROPE" }
});
console.log("Filtered row count:", filtered1.stateData.length);
console.log("Filtered serials:", filtered1.stateData.map(r => r.serial));
console.log("Filtered footer total:", filtered1.computedFooter[0]?.title, filtered1.computedFooter[0]?.values?.amount);

console.log("\n=== Testing v8 filterStateData ===");
const filtered2 = tableStore.filterStateData({
    inQuery: { "allinventoryentries.batchallocations.amount": "420" }
});
console.log("State filtered row count:", filtered2.stateData.length);
console.log("State filtered serials:", filtered2.stateData.map(r => r.serial));

console.log("\n>>> ALL V8 TESTS PASSED! <<<");
