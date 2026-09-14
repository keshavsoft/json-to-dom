/**
 * listeners — Versioned Event Hooking & Delegation Ecosystem (v27)
 *
 * Exposes:
 * - listeners: Default active delegation suite
 * - listeners.v1: Baseline row-scoped action delegation suite (v26 legacy)
 * - listeners.v2: Advanced form-scoped & footer action delegation suite
 * - bindActions: Default action binder (v2)
 */
import v1 from "./v1/index.js";
import v2 from "./v2/index.js";

export const bindActions = (inArgs) => {
    return v2.bindActions(inArgs);
};

export const listeners = {
    v1,
    v2,
    bindActions,
    bind: bindActions,
    extractFormValues: v2.extractFormValues,
    extractInputs: v1.extractInputs,
    resetForm: v2.resetForm,
    applyHighlight: v2.applyHighlight
};

// Also attach versions onto the bindActions function for convenient access
bindActions.v1 = v1.bindActions;
bindActions.v2 = v2.bindActions;

export {
    v1,
    v2
};

export default listeners;
