/**
 * data barrel — reference JSON datasets grouped as one object
 */
import tags from "../../../../docs/tags/tags.json" with { type: "json" };
import globalAllowedAttributes from "../../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };
import allowedEvents from "../../../../docs/tags/allowedEvents.json" with { type: "json" };

export const data = {
    tags,
    globalAllowedAttributes,
    allowedEvents
};

export default data;
