import buildChildrenNodes from "./buildChildrenNodes.js";
import forSpecFunc from "./forSpec/v2/index.js";

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

    if (poka.type === "spec") {
        return forSpecFunc({ raka, inData: poka.data });
    };
};

export default buildSingleElement;
