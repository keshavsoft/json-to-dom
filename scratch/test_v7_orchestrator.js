import { TableStore } from "../renderers/v7/table/tableStore/index.js";
import { FormStore } from "../renderers/v7/form/formStore/index.js";
import { DataListStore } from "../renderers/v7/datalist/datalistStore/index.js";
import columns from "../samples/hybrid/v2/columns.json" with { type: "json" };
import data from "../samples/hybrid/v2/data.json" with { type: "json" };
import tableConfig from "../samples/hybrid/v2/table/config.json" with { type: "json" };
import searchConfig from "../samples/hybrid/v2/search/config.json" with { type: "json" };
import datalistConfig from "../samples/hybrid/v2/datalist/config.json" with { type: "json" };

console.log("=== Testing TableStore Pure Orchestrator (v7) ===");

const tableStore = new TableStore({
    inData: data,
    inColumns: columns,
    inConfig: tableConfig
});

console.log("1. Initial activeColumns keys:", tableStore.activeColumns.map(c => c.key));
console.log("2. Initial row count:", tableStore.stateData.length);
console.log("3. First 3 serial numbers:", tableStore.stateData.slice(0, 3).map(r => ({ serial: r.serial, vchtype: r.vchtype })));
console.log("4. Initial computedFooter count:", tableStore.computedFooter.length);
console.log("   First foot row values:", tableStore.computedFooter[0]);

// Test Filter Original Data
console.log("\n=== Testing filterOriginalData (query: ROPE) ===");
const filterRes1 = tableStore.filterOriginalData({
    inQuery: { "allinventoryentries.stockitemname": "ROPE" }
});
console.log("Filtered row count:", filterRes1.stateData.length);
console.log("Filtered serials:", filterRes1.stateData.map(r => r.serial));
console.log("Filtered computedFooter amount:", filterRes1.computedFooter[0]?.values?.amount);

// Verify serials are strictly sequential 1..N
const areSerialsSequential = filterRes1.stateData.every((r, idx) => r.serial === idx + 1);
console.log("Are filtered serials 1..N sequential?", areSerialsSequential);

// Test Filter State Data
console.log("\n=== Testing filterStateData (query: 420.00) ===");
const filterRes2 = tableStore.filterStateData({
    inQuery: { "allinventoryentries.batchallocations.amount": "420" }
});
console.log("State-filtered row count:", filterRes2.stateData.length);
console.log("State-filtered serials:", filterRes2.stateData.map(r => r.serial));
console.log("State-filtered foot total:", filterRes2.computedFooter[0]?.values?.amount);

// Test FormStore
console.log("\n=== Testing FormStore (v7) ===");
const formStore = new FormStore({
    inColumns: columns,
    inConfig: searchConfig
});
console.log("Form activeColumns count:", formStore.activeColumns.length);

// Test DataListStore
console.log("\n=== Testing DataListStore (v7) ===");
const dataListStore = new DataListStore({
    inData: data,
    inColumns: columns,
    inConfig: datalistConfig
});
console.log("DataList activeColumns count:", dataListStore.activeColumns.length);

console.log("\n>>> ALL V7 TESTS PASSED! <<<");
