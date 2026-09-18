import buildChildrenNodes from "./buildChildrenNodes.js";
import forSpecFunc from "./forSpec/v3/index.js";

export const buildSingleElement = ({ inSpecJson, inShowLog = false, inDataJson }) => {

    // debugger;

    // const localChildrenNodes = Array.isArray(inSpecJson.children) && inSpecJson.children.length > 0
    //     ? buildChildrenNodes({
    //         inChildren: inSpecJson.children,
    //         inShowLog, inOutput: localOutput
    //     })
    //     : [];

    return forSpecFunc({ inSpecJson, inData: inDataJson });
};

export default buildSingleElement;
