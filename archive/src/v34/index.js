import registerGlobal from "./registerGlobal.js";
import inspect from "./chapters/chapter1_inspection/index.js";
import construct from "./chapters/chapter2_construction/index.js";
import activate from "./chapters/chapter3_activation/index.js";

export const buildSpecElement = ({ spec, domIdToPushTo,
    showLog, output = { type: "dom" } }) => {
    try {
        // inspect(inArgs);

        const element = construct({
            inRawSpec: spec,
            inShowLog: showLog, inOutput: output
        });

        const targetHtmlId = domIdToPushTo;

        return activate({ element, targetHtmlId });

    } catch (error) {
        console.log("error : ", error);

    };
};

export const specToDom = buildSpecElement;

registerGlobal(buildSpecElement);

export default buildSpecElement;
