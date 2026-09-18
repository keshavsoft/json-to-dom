import registerGlobal from "./registerGlobal.js";
import buildSpec from "./chapters/buildSpec/index.js";
import activate from "./chapters/chapter3_activation/index.js";

export const buildSpecElement = ({ spec, domIdToPushTo,
    showLog, output = { type: "dom" } }) => {
    try {
        const element = buildSpec({
            raka: spec,
            inShowLog: showLog, poka: output
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
