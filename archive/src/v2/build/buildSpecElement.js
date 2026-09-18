import isNullOrUndefined from "./buildSpec/isNullOrUndefined.js";
import isDomNode from "./buildSpec/isDomNode.js";
import isSpecArray from "./buildSpec/isSpecArray.js";
import isSpecObject from "./buildSpec/isSpecObject.js";
import buildSpecArray from "./buildSpec/buildSpecArray.js";
import buildSingleElement from "./buildSpec/buildSingleElement.js";

export const buildSpecElement = (inSpec) => {
    const localSpec = (inSpec && typeof inSpec === "object" && "inSpec" in inSpec && !(inSpec instanceof Node) && !Array.isArray(inSpec))
        ? inSpec.inSpec
        : inSpec;

    if (isNullOrUndefined({ inSpec: localSpec })) return null;
    if (isDomNode({ inSpec: localSpec })) return localSpec;
    if (isSpecArray({ inSpec: localSpec })) return buildSpecArray({ inSpec: localSpec });
    if (!isSpecObject({ inSpec: localSpec })) return null;

    return buildSingleElement({ inSpec: localSpec });
};

export default buildSpecElement;