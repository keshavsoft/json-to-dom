import tags from "../../../docs/tags/tags.json" with { type: "json" };

export const isTagValid = ({ inTagName }) => {
    const localTagName = inTagName?.toLowerCase();
    return Boolean(localTagName && localTagName in tags);
};

export default isTagValid;
