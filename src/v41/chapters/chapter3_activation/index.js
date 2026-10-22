import mountToContainer from "./mountToContainer.js";

const activate = ({ inElement, inTargetHtmlId, element, targetHtmlId } = {}) => {
    const localElement = inElement ?? element;
    const localTargetHtmlId = inTargetHtmlId ?? targetHtmlId;

    if (localTargetHtmlId && typeof document !== "undefined") {
        mountToContainer({ inElement: localElement, inTargetHtmlId: localTargetHtmlId });
    }

    return localElement;
};

export default activate;
