import dispatchSpec from "./index.js";

export const buildChildrenNodes = ({ inChildren, inShowLog = false, inOutput }) => {
    const localChildren = inChildren;
    const localShowLog = inShowLog;
    const localOutput = inOutput;

    if (!Array.isArray(localChildren)) return [];
    let toReturnArray = localChildren.map(child => {
        const loopInside = dispatchSpec({
            inSpec: child,
            inShowLog: localShowLog,
            inOutput: localOutput
        });

        return loopInside;
    }).flat().filter(Boolean);

    return toReturnArray;
};

export default buildChildrenNodes;
