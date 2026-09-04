import { calculateFooter } from "../tableStore/calculateFooter.js";
import { filterData } from "../tableStore/filterData.js";
import { buildTable } from "../tableBuilder/buildTable.js";
import { buildBody } from "../tableBuilder/parts/buildBody.js";
import { buildFoot } from "../tableBuilder/parts/buildFoot.js";

export class Table {
    constructor({ inColumns = [], inData = [], inFooterConfig = [], inTargetContainerId = "table-container" } = {}) {
        const localColumns = inColumns;
        const localData = inData;
        const localFooterConfig = inFooterConfig;
        const localTargetContainerId = inTargetContainerId;

        this.columns = localColumns;
        this.rawData = localData;
        this.footerConfig = localFooterConfig;
        this.containerId = localTargetContainerId;
        this.tableElement = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const initialComputedFooter = calculateFooter({
            inData: this.rawData,
            inFooterConfig: this.footerConfig
        });

        const tableSpec = buildTable({
            inColumns: this.columns,
            inData: this.rawData,
            inComputedFooter: initialComputedFooter
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

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        if (!this.tableElement) return;

        const filteredData = filterData({
            inData: this.rawData,
            inQuery: localQuery
        });

        const updatedComputedFooter = calculateFooter({
            inData: filteredData,
            inFooterConfig: this.footerConfig
        });

        const newBodySpec = buildBody({
            inColumns: this.columns,
            inData: filteredData
        });

        const newFootSpec = buildFoot({
            inColumns: this.columns,
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
