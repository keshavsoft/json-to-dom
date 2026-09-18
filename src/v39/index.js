import registerGlobal from "./registerGlobal.js";
import buildSpec from "./chapters/buildSpec/index.js";
import activate from "./chapters/chapter3_activation/index.js";
import meta from "./meta.js";

export const buildSpecElement = (inArgs = {}) => {
    try {
        const localArgs = inArgs;
        const localSpec = localArgs.spec ?? localArgs.inSpec;
        const localTargetHtmlId = localArgs.domIdToPushTo ?? localArgs.targetHtmlId ?? localArgs.inDomIdToPushTo ?? localArgs.inTargetHtmlId;
        const localShowLog = localArgs.showLog ?? localArgs.inShowLog ?? false;

        const element = buildSpec({
            inSpec: localSpec,
            inShowLog: localShowLog
        });

        return activate({ element, targetHtmlId: localTargetHtmlId });
    } catch (error) {
        console.error("error : ", error);
        throw error;
    }
};

export const specToDom = buildSpecElement;
export { meta };

registerGlobal(buildSpecElement);

export default buildSpecElement;

