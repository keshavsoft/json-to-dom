/**
 * data barrel — reference JSON datasets grouped as one object
 */
import tags from "../../../../docs/tags/tags.json" with { type: "json" };
import hybrid from "../../../../docs/tags/hybrid.json" with { type: "json" };
import globalAllowedAttributes from "../../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };
import allowedEvents from "../../../../docs/tags/allowedEvents.json" with { type: "json" };

export const data = {
    tags,
    hybrid,
    globalAllowedAttributes,
    allowedEvents
};

export default data;
