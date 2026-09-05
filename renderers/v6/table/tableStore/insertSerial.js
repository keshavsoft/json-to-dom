export const insertSerial = ({ inColumns = [], inData = [], inLabel = "#" } = {}) => {
    const localColumns = inColumns;
    const localData = inData;
    const localLabel = inLabel;

    const serialCol = {
        key: "serial",
        label: localLabel,
        align: "center",
        isSerial: true
    };

    const hasSerialCol = (Array.isArray(localColumns) ? localColumns : []).some(col => col.key === "serial");
    const updatedColumns = hasSerialCol
        ? localColumns
        : [serialCol, ...(Array.isArray(localColumns) ? localColumns : [])];

    const updatedData = (Array.isArray(localData) ? localData : []).map((row, index) => ({
        serial: index + 1,
        ...(row || {})
    }));

    return {
        columns: updatedColumns,
        data: updatedData
    };
};

export default insertSerial;
