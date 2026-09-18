import listeners, { bindActions } from "./listeners/index.js";
import mountToContainer from "./mountToContainer.js";

export const activate = (inArgs = {}) => {
    const localArgs = inArgs;
    const localElement = localArgs.element;
    const localTargetHtmlId = localArgs.targetHtmlId;

    if (localTargetHtmlId && typeof document !== "undefined") {
        mountToContainer({ element: localElement, targetHtmlId: localTargetHtmlId });
    }

    return localElement;
};

export {
    bindActions
};

export default activate;
