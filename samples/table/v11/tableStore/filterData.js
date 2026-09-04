export const filterData = ({ inData = [], inQuery = "" } = {}) => {
    const localData = inData;
    const localQuery = inQuery;

    if (!Array.isArray(localData)) return [];

    const normalizedQuery = String(localQuery ?? "").trim().toLowerCase();
    if (!normalizedQuery) return localData;

    return localData.filter(row => {
        if (!row || typeof row !== "object") return false;
        return Object.values(row).some(val => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(normalizedQuery);
        });
    });
};

export default filterData;
