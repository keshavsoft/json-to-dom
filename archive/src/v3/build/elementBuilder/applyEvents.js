export const applyEvents = ({ inElement, inEvents, inTagName }) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName;
    if (localEvents && typeof localEvents === "object") {
        Object.entries(localEvents).forEach(([eventName, listener]) => {
            localElement.addEventListener(eventName, listener);
        });
    }
    return localElement;
};

export default applyEvents;
