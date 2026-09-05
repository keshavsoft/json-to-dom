import { SourceStore } from "../../common/SourceStore.js";
import { cloneData } from "../../common/cloneData.js";
import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";
import { queryToQueryObject } from "./queryToQueryObject.js";
import { insertSerial } from "./insertSerial.js";
import { resequenceSerial } from "./resequenceSerial.js";

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

        const stateData = cloneData({
            inData: localSource?.originalData
        });

        const serialResult = insertSerial({
            inColumns: activeColumns,
            inData: stateData,
            inConfig: localSource?.config
        });

        const computedFooter = calculateFooter({
            inData: serialResult.data,
            inFooterConfig: localSource?.config?.foot
        });

        return {
            activeColumns: serialResult.columns,
            stateData: serialResult.data,
            computedFooter,
            isSerialEnabled: serialResult.isSerialEnabled
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

    _runFilterPipeline({ inData = [], inQuery = "" } = {}) {
        const localData = inData;
        const localQuery = inQuery;

        const queryObject = queryToQueryObject({
            inQuery: localQuery,
            inActiveColumns: this.library.activeColumns
        });

        const filtered = filterData({
            inData: localData,
            inQueryObject: queryObject,
            inActiveColumns: this.library.activeColumns
        });

        const resequenced = resequenceSerial({
            inData: filtered,
            inIsEnabled: this.library.isSerialEnabled
        });

        const computedFooter = calculateFooter({
            inData: resequenced,
            inFooterConfig: this.source.config?.foot
        });

        this.library.stateData = resequenced;
        this.library.computedFooter = computedFooter;

        return {
            activeColumns: this.library.activeColumns,
            stateData: this.library.stateData,
            computedFooter: this.library.computedFooter
        };
    }

    filterOriginalData({ inQuery = "" } = {}) {
        const localQuery = inQuery;
        return this._runFilterPipeline({
            inData: this.source.originalData,
            inQuery: localQuery
        });
    }

    filterStateData({ inQuery = "" } = {}) {
        const localQuery = inQuery;
        return this._runFilterPipeline({
            inData: this.library.stateData,
            inQuery: localQuery
        });
    }

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;
        return this.filterOriginalData({ inQuery: localQuery });
    }
}

export default TableStore;
