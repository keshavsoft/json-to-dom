import { SourceStore } from "../../common/SourceStore.js";
import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";
import { queryToQueryObject } from "./queryToQueryObject.js";
import { insertSerial } from "./insertSerial.js";

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

        let activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: localSource?.columns,
            inColumnKeys: localSource?.config?.head?.columns
        });

        let stateData = Array.isArray(localSource?.originalData)
            ? (typeof structuredClone === "function" ? structuredClone(localSource.originalData) : JSON.parse(JSON.stringify(localSource.originalData)))
            : [];

        const isSerialEnabled = Boolean(localSource?.config?.serial || localSource?.config?.table?.serial || localSource?.config?.head?.serial);

        if (isSerialEnabled) {
            const serialLabel = typeof localSource?.config?.serial === "object"
                ? (localSource.config.serial.label || "#")
                : "#";

            const serialResult = insertSerial({
                inColumns: activeColumns,
                inData: stateData,
                inLabel: serialLabel
            });

            activeColumns = serialResult.columns;
            stateData = serialResult.data;
        }

        const computedFooter = calculateFooter({
            inData: stateData,
            inFooterConfig: localSource?.config?.foot
        });

        return {
            activeColumns,
            stateData,
            computedFooter,
            isSerialEnabled
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

        let filtered = filterData({
            inData: this.source.originalData,
            inQueryObject: queryObject,
            inActiveColumns: this.library.activeColumns
        });

        if (this.library.isSerialEnabled) {
            const serialResult = insertSerial({
                inColumns: this.library.activeColumns,
                inData: filtered
            });
            filtered = serialResult.data;
        }

        this.library.stateData = filtered;

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

        let filtered = filterData({
            inData: this.library.stateData,
            inQueryObject: queryObject,
            inActiveColumns: this.library.activeColumns
        });

        if (this.library.isSerialEnabled) {
            const serialResult = insertSerial({
                inColumns: this.library.activeColumns,
                inData: filtered
            });
            filtered = serialResult.data;
        }

        this.library.stateData = filtered;

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
