import buildSpec from "../../index.js";

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

const startFunc = ({ inSpecJson, inData, inShowLog }) => {
    // console.log("inSpecJson, inData : ", inSpecJson, inData);

    if ("key" in inData && "value" in inData) {
        if ("textContent" in inSpecJson) {
            inSpecJson.textContent = resolveTemplate(
                inSpecJson.textContent,
                inData
            );
        };

        // if ("attributes" in inSpecJson) {
        //     inSpecJson.attributes = Object.fromEntries(
        //         Object.entries(inSpecJson.attributes).map(
        //             ([attributeName, attributeValue]) => [
        //                 attributeName,
        //                 resolveTemplate(attributeValue, inData)
        //             ]
        //         )
        //     );
        // };
    } else {

        if ("textContent" in inSpecJson) {
            inSpecJson.textContent = resolveTemplate(
                inSpecJson.textContent,
                inData
            );
        };

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

        if ("children" in inSpecJson) {
            inSpecJson.children = inSpecJson.children.map((child) => {
                return buildSpec({
                    inSpecJson: child,
                    inShowLog: inShowLog,
                    inDataJson: inData
                })
            });
        };

    };

    return inSpecJson;
};

export default startFunc;
