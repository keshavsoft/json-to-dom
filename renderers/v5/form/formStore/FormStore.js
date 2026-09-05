export class FormStore {
    constructor({ inColumns = [], inConfig = {} } = {}) {
        const localColumns = inColumns;
        const localConfig = inConfig;

        // 1. Pristine raw input universe
        this.source = this._buildSource({
            inColumns: localColumns,
            inConfig: localConfig
        });

        // 2. Working derived universe
        this.library = this._buildLibrary({
            inSource: this.source
        });
    }

    _buildSource({ inColumns = [], inConfig = {} } = {}) {
        const localColumns = inColumns;
        const localConfig = inConfig;

        return {
            columns: localColumns,
            config: localConfig
        };
    }

    _buildLibrary({ inSource } = {}) {
        const localSource = inSource;

        const activeColumns = this._resolveActiveColumns({
            inColumnsCatalog: localSource?.columns,
            inBodyConfig: localSource?.config?.body
        });

        return {
            activeColumns
        };
    }

    get activeColumns() {
        return this.library.activeColumns;
    }

    get config() {
        return this.source.config;
    }

    _resolveActiveColumns({ inColumnsCatalog = [], inBodyConfig = {} } = {}) {
        const localCatalog = inColumnsCatalog;
        const localBody = inBodyConfig;

        if (Array.isArray(localBody?.columns) && localBody.columns.length > 0) {
            const catalogMap = new Map((Array.isArray(localCatalog) ? localCatalog : []).map(col => [col.key, col]));
            return localBody.columns
                .map(key => catalogMap.get(key))
                .filter(Boolean);
        }

        return Array.isArray(localCatalog) ? localCatalog : [];
    }
}

export default FormStore;
