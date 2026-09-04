import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import footerConfig from "./footer.json" with { type: "json" };
import { calculateFooter } from "./tableStore/calculateFooter.js";
import { buildTable } from "./tableBuilder/buildTable.js";
import { renderTable } from "./renderTable.js";

const startFunc = () => {
    // 1. Data Store multi-row calculations (aggregations + evaluations)
    const computedFooter = calculateFooter({ inData: data, inFooterConfig: footerConfig });

    // 2. Build DOM spec
    const tableSpec = buildTable({
        inColumns: columns,
        inData: data,
        inComputedFooter: computedFooter
    });

    // 3. Render into DOM
    renderTable({ inSpec: tableSpec, inTargetContainerId: "table-container" });
};

startFunc();
