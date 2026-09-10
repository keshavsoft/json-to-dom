/**
 * getHookedEvents - Runtime Inspection Helper
 * Returns all internal and declared events hooked onto a given DOM element.
 */
export const getHookedEvents = ({ inElement } = {}) => {
    const localElement = inElement;

    if (!localElement) return { internal: [], declared: [] };

    return localElement.__ksEvents || { internal: [], declared: [] };
};

export default getHookedEvents;
