import { SourceStore } from "../../common/SourceStore.js";
import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";
import { queryToQueryObject } from "./queryToQueryObject.js";

export class TableStore extends SourceStore {
    constructor({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        super({
            inData: localData,
            inColumns: localColumns,
            inConfig: localConfig
        });

        this.library = this._buildLibrary({
            inSource: this.source
        });
    }

    _buildLibrary({ inSource } = {}) {
        const localSource = inSource;

        const activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: localSource?.columns,
            inColumnKeys: localSource?.config?.head?.columns
        });

        const stateData = Array.isArray(localSource?.originalData)
            ? (typeof structuredClone === "function" ? structuredClone(localSource.originalData) : JSON.parse(JSON.stringify(localSource.originalData)))
            : [];

        const computedFooter = calculateFooter({
            inData: stateData,
            inFooterConfig: localSource?.config?.foot
        });

        return {
            activeColumns,
            stateData,
            computedFooter
        };
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
