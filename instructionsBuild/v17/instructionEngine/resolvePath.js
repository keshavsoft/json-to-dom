/**
 * Resolves a dot-delimited path against a data object or array.
 * 
 * @param {Object} inArgs
 * @param {any} inArgs.inData - The source data payload
 * @param {string|Array<string>} [inArgs.inPath] - The path to resolve (e.g., "user.name", "items.0.title")
 * @returns {any} - The resolved value, or undefined if not found
 */
export const resolvePath = ({ inData, inPath }) => {
    const localData = inData;
    const localPath = inPath;

    if (localData === null || localData === undefined) return undefined;
    if (localPath === undefined || localPath === null || localPath === "" || localPath === ".") {
        return localData;
    }

    const localSegments = Array.isArray(localPath) ? localPath : String(localPath).split(".");
    let localCurrent = localData;

    for (const localSegment of localSegments) {
        if (localCurrent === null || localCurrent === undefined) {
            return undefined;
        }
        localCurrent = localCurrent[localSegment];
    }

    return localCurrent;
};

export default resolvePath;
