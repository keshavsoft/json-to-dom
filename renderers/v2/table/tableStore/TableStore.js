import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";

export class TableStore {
    constructor({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        // Clone original data to ensure the source data cannot be mutated from outside
        this.originalData = Array.isArray(localData)
            ? (typeof structuredClone === "function" ? structuredClone(localData) : JSON.parse(JSON.stringify(localData)))
            : [];
        this.columnsCatalog = localColumns;
        this.config = localConfig;

        this.activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: this.columnsCatalog,
            inHeadConfig: this.config?.head
        });

        // Dedicated filter state protecting actual data
        this.filterState = {
            query: "",
            data: [...this.originalData]
        };

        this.computedFooter = calculateFooter({
            inData: this.filterState.data,
            inFooterConfig: this.config?.foot
        });
    }

    get rawData() {
        return this.originalData;
    }

    get filteredData() {
        return this.filterState.data;
    }

    getFilterState() {
        return {
            query: this.filterState.query,
            data: [...this.filterState.data]
        };
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

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        this.filterState.query = localQuery;
        this.filterState.data = filterData({
            inData: this.originalData,
            inQuery: localQuery
        });

        this.computedFooter = calculateFooter({
            inData: this.filterState.data,
            inFooterConfig: this.config?.foot
        });

        return {
            activeColumns: this.activeColumns,
            filteredData: this.filterState.data,
            computedFooter: this.computedFooter,
            filterState: this.getFilterState()
        };
    }
}

export default TableStore;
