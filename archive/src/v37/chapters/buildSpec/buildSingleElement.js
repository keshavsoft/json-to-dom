import domElementBuilder from "./elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";
import forSpecFunc from "./forSpec/v2/index.js";

const resolveTemplate = (template, data) => {
    return template.replace(/\$\{([^}]+)\}/g, (_, path) => {
        const keys = path.trim().split(".");
        let value = data;

        for (const key of keys) {
            if (value === null || value === undefined) return "";
            value = value[key];
        }

        // Primitive → insert as text
        if (
            value === null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return String(value ?? "");
        }

        // Object / Array → keep the complete tree
        return value;
    });
};

export const buildSingleElement = ({ raka, inShowLog = false, poka }) => {
    const localChildrenNodes = Array.isArray(raka.children) && raka.children.length > 0
        ? buildChildrenNodes({
            inChildren: raka.children,
            inShowLog: localShowLog, inOutput: localOutput
        })
        : [];

    if (poka.type === "spec") {
        return forSpecFunc({ raka, inData: poka.data });
    };
};

export default buildSingleElement;
