import { TableStore } from "../tableStore/TableStore.js";
import { buildTable } from "../tableBuilder/buildTable.js";
import { buildBody } from "../tableBuilder/parts/buildBody.js";
import { buildFoot } from "../tableBuilder/parts/buildFoot.js";

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

    filter({ query = "" } = {}) {
        const localQuery = query;

        if (!this.tableElement) return;

        this.store.filter({ inQuery: localQuery });

        const newBodySpec = buildBody({
            inColumns: this.store.activeColumns,
            inData: this.store.filteredData,
            inRowConfig: this.store.config?.row
        });

        const newFootSpec = buildFoot({
            inColumns: this.store.activeColumns,
            inComputedFooter: this.store.computedFooter
        });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        if (typeof builder !== "function") return;

        const newTbody = builder({ inSpec: newBodySpec });
        const newTfoot = newFootSpec ? builder({ inSpec: newFootSpec }) : null;

        const currentTbody = this.tableElement.querySelector("tbody");
        const currentTfoot = this.tableElement.querySelector("tfoot");

        if (currentTbody && newTbody) {
            currentTbody.replaceWith(newTbody);
        }

        if (currentTfoot && newTfoot) {
            currentTfoot.replaceWith(newTfoot);
        } else if (currentTfoot && !newTfoot) {
            currentTfoot.remove();
        } else if (!currentTfoot && newTfoot) {
            this.tableElement.appendChild(newTfoot);
        }
    }
}

export default Table;
