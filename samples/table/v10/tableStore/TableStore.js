import { calculateFooter } from "./calculateFooter.js";
import { filterData } from "./filterData.js";

export class TableStore {
    constructor({ inData = [], inColumns = [], inConfig = {} } = {}) {
        const localData = inData;
        const localColumns = inColumns;
        const localConfig = inConfig;

        this.rawData = localData;
        this.columnsCatalog = localColumns;
        this.config = localConfig;

        this.activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: this.columnsCatalog,
            inHeadConfig: this.config?.head
        });

        this.filteredData = Array.isArray(this.rawData) ? [...this.rawData] : [];

        this.computedFooter = calculateFooter({
            inData: this.filteredData,
            inFooterConfig: this.config?.foot
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

    filter({ inQuery = "" } = {}) {
        const localQuery = inQuery;

        this.filteredData = filterData({
            inData: this.rawData,
            inQuery: localQuery
        });

        this.computedFooter = calculateFooter({
            inData: this.filteredData,
            inFooterConfig: this.config?.foot
        });

        return {
            activeColumns: this.activeColumns,
            filteredData: this.filteredData,
            computedFooter: this.computedFooter
        };
    }
}

export default TableStore;
