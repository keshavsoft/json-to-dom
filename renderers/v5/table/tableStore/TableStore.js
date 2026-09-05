import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";
import { queryToQueryObject } from "./queryToQueryObject.js";

export class TableStore {
    constructor({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        // 1. Pristine raw input universe
        this.source = this._buildSource({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });

        // 2. Working derived universe
        this.library = this._buildLibrary({
            inSource: this.source
        });
    }

    _buildSource({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        return {
            originalData: Array.isArray(localData)
                ? (typeof structuredClone === "function" ? structuredClone(localData) : JSON.parse(JSON.stringify(localData)))
                : [],
            columns: localColumns,
            config: localConfig
        };
    }

    _buildLibrary({ inSource } = {}) {
        const localSource = inSource;

        const activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: localSource.columns,
            inHeadConfig: localSource.config?.head
        });

        const stateData = Array.isArray(localSource.originalData)
            ? (typeof structuredClone === "function" ? structuredClone(localSource.originalData) : JSON.parse(JSON.stringify(localSource.originalData)))
            : [];

        const computedFooter = calculateFooter({
            inData: stateData,
            inFooterConfig: localSource.config?.foot
        });

        return {
            activeColumns,
            stateData,
            computedFooter
        };
    }

    get rawData() {
        return this.source.originalData;
    }

    get stateData() {
        return this.library.stateData;
    }

    get filteredData() {
        return this.library.stateData;
    }

    get activeColumns() {
        return this.library.activeColumns;
    }

    get computedFooter() {
        return this.library.computedFooter;
    }

    get config() {
        return this.source.config;
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
            inActiveColumns: this.library.activeColumns
        });

        this.library.stateData = filterData({
            inData: this.source.originalData,
            inQueryObject: queryObject,
            inActiveColumns: this.library.activeColumns
        });

        this.library.computedFooter = calculateFooter({
            inData: this.library.stateData,
            inFooterConfig: this.source.config?.foot
        });

        return {
            activeColumns: this.library.activeColumns,
            stateData: this.library.stateData,
            computedFooter: this.library.computedFooter
        };
    }

    filterStateData({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        const queryObject = queryToQueryObject({
            inQuery: localQuery,
            inActiveColumns: this.library.activeColumns
        });

        this.library.stateData = filterData({
            inData: this.library.stateData,
            inQueryObject: queryObject,
            inActiveColumns: this.library.activeColumns
        });

        this.library.computedFooter = calculateFooter({
            inData: this.library.stateData,
            inFooterConfig: this.source.config?.foot
        });

        return {
            activeColumns: this.library.activeColumns,
            stateData: this.library.stateData,
            computedFooter: this.library.computedFooter
        };
    }

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;
        return this.filterOriginalData({ inQuery: localQuery });
    }
}

export default TableStore;
