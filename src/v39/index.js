import registerGlobal from "./registerGlobal.js";
import buildSpec from "./chapters/buildSpec/index.js";
import activate from "./chapters/chapter3_activation/index.js";

export const buildSpecElement = ({ spec, domIdToPushTo, showLog }) => {
    try {
        // inspect(inArgs);

        const element = buildSpec({
            inSpec: spec,
            inShowLog: showLog
        });

        const targetHtmlId = domIdToPushTo;
        // console.log("element :", element);

        return activate({ element, targetHtmlId });

    } catch (error) {
        console.log("error : ", error);

    };
};

export const specToDom = buildSpecElement;

registerGlobal(buildSpecElement);

export default buildSpecElement;
