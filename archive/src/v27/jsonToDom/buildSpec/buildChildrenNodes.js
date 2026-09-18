import dispatchSpec from "./index.js";

export const buildChildrenNodes = ({ inChildren, inShowLog = false }) => {
    const localChildren = inChildren;
    const localShowLog = inShowLog;

    if (!Array.isArray(localChildren)) return [];

    return localChildren.map(child => {
        if (typeof child === "string" || typeof child === "number") {
            return typeof document !== "undefined"
                ? document.createTextNode(String(child))
                : String(child);
        }
        return dispatchSpec({
            inSpec: child,
            inShowLog: localShowLog
        });
    }).flat().filter(Boolean);
};

export default buildChildrenNodes;
