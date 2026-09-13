/**
 * data barrel — reference W3C/WHATWG HTML standard datasets grouped as one object
 */
import tags from "../../../../docs/tags/tags.json" with { type: "json" };
import globalAllowedAttributes from "../../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };

export const data = {
    tags,
    globalAllowedAttributes
};

export default data;
