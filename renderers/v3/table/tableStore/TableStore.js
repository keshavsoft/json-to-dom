import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";
import { queryToQueryObject } from "./queryToQueryObject.js";

export class TableStore {
    constructor({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        // Immutable baseline original data
        this.originalData = Array.isArray(localData)
            ? (typeof structuredClone === "function" ? structuredClone(localData) : JSON.parse(JSON.stringify(localData)))
            : [];

        // Active state data mutated by filters
        this.stateData = Array.isArray(localData)
            ? (typeof structuredClone === "function" ? structuredClone(localData) : JSON.parse(JSON.stringify(localData)))
            : [];

        this.columnsCatalog = localColumns;
        this.config = localConfig;

        this.activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: this.columnsCatalog,
            inHeadConfig: this.config?.head
        });

        this.computedFooter = calculateFooter({
            inData: this.stateData,
            inFooterConfig: this.config?.foot
        });
    }

    get rawData() {
        return this.originalData;
    }

    get filteredData() {
        return this.stateData;
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

    filterOriginalData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        const queryObject = queryToQueryObject({
            inQuery: localQuery,
            inActiveColumns: this.activeColumns
        });

        this.stateData = filterData({
            inData: this.originalData,
            inQueryObject: queryObject,
            inActiveColumns: this.activeColumns
        });

        this.computedFooter = calculateFooter({
            inData: this.stateData,
            inFooterConfig: this.config?.foot
        });

        return {
            activeColumns: this.activeColumns,
            stateData: this.stateData,
            computedFooter: this.computedFooter
        };
    }

    filterStateData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        const queryObject = queryToQueryObject({
            inQuery: localQuery,
            inActiveColumns: this.activeColumns
        });

        this.stateData = filterData({
            inData: this.stateData,
            inQueryObject: queryObject,
            inActiveColumns: this.activeColumns
        });

        this.computedFooter = calculateFooter({
            inData: this.stateData,
            inFooterConfig: this.config?.foot
        });

        return {
            activeColumns: this.activeColumns,
            stateData: this.stateData,
            computedFooter: this.computedFooter
        };
    }

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;
        return this.filterOriginalData({ inQuery: localQuery });
    }
}

export default TableStore;
