import domElementBuilder from "./elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";

const resolvePath = (path, data) => {
    const parts = path.split(".");

    let value = data;

    for (const part of parts) {
        if (value === null || value === undefined) {
            return undefined;
        }

        value = value[part];
    }

    return value;
};

const replaceValue = (value, data) => {

    if (typeof value !== "string") {
        return value;
    }

    const match = value.match(/^\$\{(.+?)\}$/);

    if (!match) {
        return value;
    }

    return resolvePath(match[1], data);
};

export const buildSingleElement = ({ raka, inShowLog = false, poka }) => {
    if (!raka?.tagName) {
        if (localShowLog) {
            console.warn("[json-to-dom v23] Missing tagName on spec:", raka);
        }
        return null;
    };

    const localChildrenNodes = Array.isArray(raka.children) && raka.children.length > 0
        ? buildChildrenNodes({
            inChildren: raka.children,
            inShowLog: localShowLog, inOutput: localOutput
        })
        : [];


    if (poka.type === "dom") {
        return domElementBuilder({
            raka: {
                ...raka,
                children: localChildrenNodes
            }
        });
    };

    if (poka.type === "spec") {
        // raka.textContent = poka.data;
        console.log("raka :", raka, poka);
        debugger;
        raka.textContent = replaceValue(raka.textContent, poka.data);

        return raka;
        // return domElementBuilder({
        //     inSpec: {
        //         ...localSpec,
        //         children: localChildrenNodes
        //     }
        // });
    };
};

export default buildSingleElement;
