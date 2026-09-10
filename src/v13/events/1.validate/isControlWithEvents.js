import allowedEvents from "../../../../docs/tags/allowedEvents.json" with { type: "json" };

export const isControlWithEvents = ({ inTagName }) => {
    const localTagName = inTagName?.toLowerCase();
    if (!localTagName) return false;
    return Boolean(allowedEvents.controls && localTagName in allowedEvents.controls);
};

export default isControlWithEvents;
