import mountToContainer from "./mountToContainer.js";

const activate = (inArgs = {}) => {
    const localArgs = inArgs;
    const localElement = localArgs.element;
    const localTargetHtmlId = localArgs.targetHtmlId;

    if (localTargetHtmlId && typeof document !== "undefined") {
        mountToContainer({ element: localElement, targetHtmlId: localTargetHtmlId });
    }

    return localElement;
};

export default activate;
