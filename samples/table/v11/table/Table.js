import { TableStore } from "../tableStore/TableStore.js";
import { buildTable } from "../tableBuilder/buildTable.js";
import { repaintBody } from "./repaints/repaintBody.js";
import { repaintFoot } from "./repaints/repaintFoot.js";
import { pruneTreeWithIds } from "./pruneTreeWithIds.js";

export class Table {
    constructor({ inData = [], inColumns = [], inConfig = {}, inTargetContainerId = "table-container", data, columns, config, targetContainerId } = {}) {
        const localData = inData || data || [];
        const localColumns = inColumns || columns || [];
        const localConfig = inConfig || config || {};
        const localTargetContainerId = inTargetContainerId || targetContainerId || "table-container";

        this.containerId = localTargetContainerId;
        this.tableElement = null;
        this.controlsTree = null;

        this.store = new TableStore({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return null;

        const tableSpec = buildTable({
            inColumns: this.store.activeColumns,
            inData: this.store.filteredData,
            inComputedFooter: this.store.computedFooter,
            inRowConfig: this.store.config?.row
        });

        // Extract pruned tree with controls having IDs only (like Form v4)
        this.controlsTree = pruneTreeWithIds({ inSpec: tableSpec });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        if (typeof builder !== "function") {
            console.error("json-to-dom buildSpecElement not found on window.ks");
            return this.controlsTree;
        }

        const domElement = builder({ inSpec: tableSpec });
        this.tableElement = Array.isArray(domElement) ? domElement[0] : domElement;

        container.innerHTML = "";
        container.appendChild(this.tableElement);

        return this.controlsTree;
    }

    getControlsTree() {
        return this.controlsTree;
    }

    repaintBody() {
        if (!this.tableElement) return;

        repaintBody({
            inTableElement: this.tableElement,
            inColumns: this.store.activeColumns,
            inData: this.store.filteredData,
            inRowConfig: this.store.config?.row
        });
    }

    repaintFoot() {
        if (!this.tableElement) return;

        repaintFoot({
            inTableElement: this.tableElement,
            inColumns: this.store.activeColumns,
            inComputedFooter: this.store.computedFooter
        });
    }

    filter({ inQuery = "", query = "" } = {}) {
        const localQuery = inQuery || query;

        if (!this.tableElement) return;

        this.store.filter({ inQuery: localQuery });
        this.repaintBody();
        this.repaintFoot();
    }
}

export default Table;
