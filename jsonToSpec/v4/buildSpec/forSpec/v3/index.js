const resolveTemplate = (template, data) => {
    if (typeof template !== "string") {
        return template;
    }

    return template.replace(/\$\{([^}]+)\}/g, (_, path) => {

        const keys = path.trim().split(".");

        let value = data;

        for (const key of keys) {
            if (value === null || value === undefined) {
                return "";
            }

            value = value[key];
        }

        if (
            value === null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return String(value ?? "");
        }

        return value;
    });
};

const startFunc = ({ inSpecJson, inData }) => {
    inSpecJson.textContent = resolveTemplate(
        inSpecJson.textContent,
        inData
    );

    if ("attributes" in inSpecJson) {
        inSpecJson.attributes = Object.fromEntries(
            Object.entries(inSpecJson.attributes).map(
                ([attributeName, attributeValue]) => [
                    attributeName,
                    resolveTemplate(attributeValue, inData)
                ]
            )
        );
    };

    return inSpecJson;
};

export default startFunc;
