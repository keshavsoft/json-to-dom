/**
 * Chapter 3: Activation & Interactivity
 * 
 * Houses event listener delegation, form extraction, and container mounting.
 */
import listeners, { bindActions, v1, v2 } from "./listeners/index.js";
import mountToContainer from "./mountToContainer.js";

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

export default {
    listeners,
    bindActions,
    mountToContainer,
    formOperations,
    v1,
    v2
};
