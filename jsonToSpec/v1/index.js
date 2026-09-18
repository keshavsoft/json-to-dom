import registerGlobal from "./registerGlobal.js";
import construct from "./chapters/chapter2_construction/index.js";

const buildSpecElement = ({ spec, domIdToPushTo,
    showLog, output = { type: "dom" } }) => {
    try {
        const element = construct({
            raka: spec,
            inShowLog: showLog, poka: output
        });

        return element;
    } catch (error) {
        console.log("error : ", error);

    };
};

registerGlobal(buildSpecElement);

export default buildSpecElement;
