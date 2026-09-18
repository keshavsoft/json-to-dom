import dispatchSpec from "./index.js";

export const buildChildrenNodes = ({ inChildren, inShowLog = false, inOutput }) => {
    const localChildren = inChildren;
    const localShowLog = inShowLog;
    const localOutput = inOutput;

    if (!Array.isArray(localChildren)) return [];

    return localChildren.map(child => {
        if (typeof child === "string" || typeof child === "number") {
            return typeof document !== "undefined"
                ? document.createTextNode(String(child))
                : String(child);
        };
        return dispatchSpec({
            inSpec: child,
            inShowLog: localShowLog,
            inOutput: localOutput
        });
    }).flat().filter(Boolean);
};

export default buildChildrenNodes;
