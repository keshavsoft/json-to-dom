/**
 * Sets a value at a nested dot-delimited path on a target object.
 * Mutates the target object and returns it.
 * 
 * @param {Object} inArgs
 * @param {Object} inArgs.inTarget - The object to modify
 * @param {string} inArgs.inPath - Dot-delimited path (e.g. "props.textContent", "props.dataset.id")
 * @param {any} inArgs.inValue - The value to assign
 * @returns {Object} - The modified target object
 */
export const setNestedValue = ({ inTarget, inPath, inValue }) => {
    const localTarget = inTarget;
    const localPath = inPath;
    const localValue = inValue;

    if (!localTarget || !localPath) return localTarget;

    const localSegments = String(localPath).split(".");
    let localCurrent = localTarget;

    for (let localIndex = 0; localIndex < localSegments.length - 1; localIndex += 1) {
        const localKey = localSegments[localIndex];
        if (
            !(localKey in localCurrent) ||
            typeof localCurrent[localKey] !== "object" ||
            localCurrent[localKey] === null
        ) {
            localCurrent[localKey] = {};
        }
        localCurrent = localCurrent[localKey];
    }

    const localFinalKey = localSegments[localSegments.length - 1];
    localCurrent[localFinalKey] = localValue;

    return localTarget;
};

export default setNestedValue;
