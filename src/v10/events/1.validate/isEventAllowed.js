import allowedEvents from "../../../../docs/tags/allowedEvents.json" with { type: "json" };

export const isEventAllowed = ({ inTagName, inEventName }) => {
    const localTagName = inTagName?.toLowerCase();
    const localEventName = inEventName?.toLowerCase();

    if (!localTagName || !localEventName) return false;

    const allowedList = allowedEvents.controls?.[localTagName];
    if (!Array.isArray(allowedList)) return false;

    return allowedList.includes(localEventName);
};

export default isEventAllowed;
