import buildSpecElement from "../index.js";

export const buildChildrenNodes = ({ inChildren, inApplyEvents = false, inShowLog = false }) => {
    const localChildren = inChildren;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!Array.isArray(localChildren)) return [];

    return localChildren.map(child => {
        if (typeof child === "string" || typeof child === "number") {
            return typeof document !== "undefined"
                ? document.createTextNode(String(child))
                : String(child);
        }
        return buildSpecElement({
            inSpec: child,
            inApplyEvents: localApplyEvents,
            inShowLog: localShowLog
        });
    }).flat().filter(Boolean);
};

export default buildChildrenNodes;
