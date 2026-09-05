import { TableStore } from "./tableStore/TableStore.js";
import { buildTable } from "./tableBuilder/buildTable.js";
import { pruneTreeWithIds } from "../common/pruneTreeWithIds.js";
import { repaintBody, repaintFoot, refreshTable } from "./repaints/index.js";
import { filterTable, filterOriginalTable, filterStateTable } from "./filter/filterTable.js";

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
            inData: this.store.stateData,
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

        return {
            treeWithIds: this.controlsTree,
            spec: tableSpec,
            element: this.tableElement
        };
    }

    getControlsTree() {
        return this.controlsTree;
    }

    repaintBody() {
        if (!this.tableElement) return;

        repaintBody({
            inTableElement: this.tableElement,
            inColumns: this.store.activeColumns,
            inData: this.store.stateData,
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

    refreshTable() {
        if (!this.tableElement) return;

        refreshTable({
            inTableElement: this.tableElement,
            inStore: this.store
        });
    }

    filterOriginalData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        filterOriginalTable({
            inTable: this,
            inQuery: localQuery
        });
    }

    filterStateData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        filterStateTable({
            inTable: this,
            inQuery: localQuery
        });
    }

    filter({ inQuery = "", query = "" } = {}) {
        const localQuery = inQuery || query;
        this.filterOriginalData({ inQuery: localQuery });
    }
}

export { repaintBody, repaintFoot, refreshTable } from "./repaints/index.js";
export { filterTable, filterOriginalTable, filterStateTable } from "./filter/filterTable.js";
export default Table;
