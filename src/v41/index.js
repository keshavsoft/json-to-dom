import registerGlobal from "./register/index.js";

const appendToDom = ({ buildSpec, targetHtmlId, appendPosition, showLog }) => {
    const content = buildSpec;
    const localTargetHtmlId = targetHtmlId;
    const localAppendPosition = appendPosition;
    const localShowLog = showLog;

    if (localShowLog) console.log("renderToDom 1 (content):", content);

    const container = document.getElementById(localTargetHtmlId);
    if (!container) return null;

    const isCollection = Array.isArray(content) ||
        content instanceof NodeList ||
        content instanceof HTMLCollection;

    if (isCollection) {
        if (localAppendPosition === "prepend") {
            container.prepend(...content);
        } else {
            container.append(...content);
        };
    } else {
        if (localAppendPosition === "prepend") {
            container.prepend(content);
        } else {
            container.innerHTML = "";
            container.append(content);
        };
    };

    if (localShowLog) console.log("renderToDom 2 (mounted):", container);

    return container;
};

registerGlobal(appendToDom);

export default appendToDom;