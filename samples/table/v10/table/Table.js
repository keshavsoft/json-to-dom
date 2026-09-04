import { TableStore } from "../tableStore/TableStore.js";
import { buildTable } from "../tableBuilder/buildTable.js";
import { repaintBody } from "./repaints/repaintBody.js";
import { repaintFoot } from "./repaints/repaintFoot.js";

export class Table {
    constructor({ data = [], columns = [], config = {}, targetContainerId = "table-container" } = {}) {
        const localData = data;
        const localColumns = columns;
        const localConfig = config;
        const localTargetContainerId = targetContainerId;

        this.containerId = localTargetContainerId;
        this.tableElement = null;

        this.store = new TableStore({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const tableSpec = buildTable({
            inColumns: this.store.activeColumns,
            inData: this.store.filteredData,
            inComputedFooter: this.store.computedFooter,
            inRowConfig: this.store.config?.row
        });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        if (typeof builder !== "function") {
            console.error("json-to-dom buildSpecElement not found on window.ks");
            return;
        }

        const domElement = builder({ inSpec: tableSpec });
        this.tableElement = Array.isArray(domElement) ? domElement[0] : domElement;

        container.innerHTML = "";
        container.appendChild(this.tableElement);
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

    filter({ query = "" } = {}) {
        const localQuery = query;

        if (!this.tableElement) return;

        this.store.filter({ inQuery: localQuery });
        this.repaintBody();
        this.repaintFoot();
    }
}

export default Table;
