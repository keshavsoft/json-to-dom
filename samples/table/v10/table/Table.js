import { calculateFooter } from "../tableStore/calculateFooter.js";
import { filterData } from "../tableStore/filterData.js";
import { buildTable } from "../tableBuilder/buildTable.js";
import { buildBody } from "../tableBuilder/parts/buildBody.js";
import { buildFoot } from "../tableBuilder/parts/buildFoot.js";

export class Table {
    constructor({ data = [], columns = [], config = {}, targetContainerId = "table-container" } = {}) {
        const localData = data;
        const localColumns = columns;
        const localConfig = config;
        const localTargetContainerId = targetContainerId;

        this.rawData = localData;
        this.columnsCatalog = localColumns;
        this.config = localConfig;
        this.containerId = localTargetContainerId;
        this.tableElement = null;

        this.activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: this.columnsCatalog,
            inHeadConfig: this.config?.head
        });
    }

    _resolveActiveColumns({ inColumnsCatalog = [], inHeadConfig = {} } = {}) {
        const localCatalog = inColumnsCatalog;
        const localHead = inHeadConfig;

        if (Array.isArray(localHead?.columns) && localHead.columns.length > 0) {
            const catalogMap = new Map(localCatalog.map(col => [col.key, col]));
            return localHead.columns
                .map(key => catalogMap.get(key))
                .filter(Boolean);
        }

        return localCatalog;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const initialComputedFooter = calculateFooter({
            inData: this.rawData,
            inFooterConfig: this.config?.foot
        });

        const tableSpec = buildTable({
            inColumns: this.activeColumns,
            inData: this.rawData,
            inComputedFooter: initialComputedFooter,
            inRowConfig: this.config?.row
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

        const filteredData = filterData({
            inData: this.rawData,
            inQuery: localQuery
        });

        const updatedComputedFooter = calculateFooter({
            inData: filteredData,
            inFooterConfig: this.config?.foot
        });

        const newBodySpec = buildBody({
            inColumns: this.activeColumns,
            inData: filteredData,
            inRowConfig: this.config?.row
        });

        const newFootSpec = buildFoot({
            inColumns: this.activeColumns,
            inComputedFooter: updatedComputedFooter
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
