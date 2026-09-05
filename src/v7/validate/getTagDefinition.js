import tags from "../../../docs/tags/tags.json" with { type: "json" };

export const getTagDefinition = ({ inTagName }) => {
    const localTagName = inTagName?.toLowerCase();
    return tags[localTagName] || null;
};

export default getTagDefinition;
