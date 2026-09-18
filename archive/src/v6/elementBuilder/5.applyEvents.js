export const applyEvents = ({ inElement, inEvents }) => {
    const localElement = inElement;
    const localEvents = inEvents;
    if (localEvents && typeof localEvents === "object") {
        Object.entries(localEvents).forEach(([eventName, listener]) => {
            localElement.addEventListener(eventName, listener);
        });
    }
    return localElement;
};

export default applyEvents;
