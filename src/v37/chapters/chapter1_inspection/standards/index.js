import tags from "../../../../../docs/tags/tags.json" with { type: "json" };
import globalAllowedAttributes from "../../../../../docs/tags/globalAllowedAttributes.json" with { type: "json" };
import schema from "../../../../../docs/tags/tags.schema.json" with { type: "json" };
import guards from "../../../../../docs/tags/tags.guards.json" with { type: "json" };
import guardTags from "./guardTags.js";

export const data = {
    tags,
    globalAllowedAttributes,
    schema,
    guards
};

export {
    guardTags
};

export default data;
