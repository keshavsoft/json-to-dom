import dispatchSpec from "./index.js";

export const buildChildrenNodes = ({ inChildren, inShowLog = false }) => {
    const localChildren = inChildren;
    const localShowLog = inShowLog;

    if (!Array.isArray(localChildren)) return [];
    let toReturnArray = localChildren.map(child => {
        const loopInside = dispatchSpec({
            inSpec: child,
            inShowLog: localShowLog
        });

        return loopInside;
    }).flat().filter(Boolean);

    return toReturnArray;
};

export default buildChildrenNodes;
