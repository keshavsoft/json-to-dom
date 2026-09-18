const resolveTemplate = (template, data) => {

    console.log("bbbbbbbbbb---- :", template, data);

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

const startFunc = ({ raka, inData }) => {

    raka.textContent = resolveTemplate(
        raka.textContent,
        inData
    );

    if ("attributes" in raka) {

        raka.attributes = Object.fromEntries(
            Object.entries(raka.attributes).map(
                ([attributeName, attributeValue]) => [
                    attributeName,
                    resolveTemplate(attributeValue, inData)
                ]
            )
        );

    }

    return raka;
};

export default startFunc;
