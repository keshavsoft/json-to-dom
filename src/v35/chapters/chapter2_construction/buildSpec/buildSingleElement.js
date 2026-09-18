import domElementBuilder from "./elementBuilder/index.js";
import buildChildrenNodes from "./buildChildrenNodes.js";

export const buildSingleElement = ({ inSpec, inShowLog = false, inOutput }) => {
    const localSpec = inSpec;
    const localShowLog = inShowLog;
    const localOutput = inOutput;

    if (!localSpec?.tagName) {
        if (localShowLog) {
            console.warn("[json-to-dom v23] Missing tagName on spec:", localSpec);
        }
        return null;
    };

    const localChildrenNodes = Array.isArray(localSpec.children) && localSpec.children.length > 0
        ? buildChildrenNodes({
            inChildren: localSpec.children,
            inShowLog: localShowLog, inOutput: localOutput
        })
        : [];
    console.log("inOutput :", localOutput);

    if (localOutput.type === "dom") {
        return domElementBuilder({
            inSpec: {
                ...localSpec,
                children: localChildrenNodes
            }
        });
    };

    if (localOutput.type === "spec") {
        console.log("end :", localSpec, localOutput.data);

        return localSpec;
        // return domElementBuilder({
        //     inSpec: {
        //         ...localSpec,
        //         children: localChildrenNodes
        //     }
        // });
    };
};

export default buildSingleElement;
