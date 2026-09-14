import listeners, { bindActions, v1, v2 } from "./listeners/index.js";
import mountToContainer from "./mountToContainer.js";

export const activate = ({ element, targetHtmlId, outputType = "dom" } = {}) => {
    if (targetHtmlId && typeof document !== "undefined") {
        mountToContainer({ element, targetHtmlId });
    }

    if (outputType === "html") {
        if (!element) return "";
        return Array.isArray(element)
            ? element.map(el => el.outerHTML).join("\n")
            : element.outerHTML;
    }

    return element;
};

export const formOperations = {
    extractFormValues: listeners.extractFormValues,
    extractInputs: listeners.extractInputs,
    resetForm: listeners.resetForm,
    applyHighlight: listeners.applyHighlight
};

export {
    listeners,
    bindActions,
    mountToContainer,
    v1,
    v2
};

export default activate;
