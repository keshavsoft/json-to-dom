import tags from "../../../docs/tags/tags.json" with { type: "json" };

export const validateTag = ({ inTagName, inSpec }) => {
    const localTagName = (inTagName || inSpec?.tagName)?.toLowerCase();

    if (!localTagName) {
        return {
            isValid: false,
            tagName: null,
            definition: null,
            error: "Missing tagName"
        };
    }

    if (!(localTagName in tags)) {
        return {
            isValid: false,
            tagName: localTagName,
            definition: null,
            error: `Tag <${localTagName}> is not recognized in tags.json`
        };
    }

    return {
        isValid: true,
        tagName: localTagName,
        definition: tags[localTagName],
        error: null
    };
};

export default validateTag;
