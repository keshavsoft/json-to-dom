/**
 * listeners.v2 — Form-Level & Footer Action Delegation Suite (v27)
 *
 * Exposes:
 * - bindActions: Form footer & container action listener
 * - extractFormValues: Multi-field form data extractor
 * - resetForm: Form fields reset utility
 * - applyHighlight: Dynamic visual feedback
 */
import bindActions from "./bindActions.js";
import extractFormValues from "./extractFormValues.js";
import resetForm from "./resetForm.js";
import applyHighlight from "./applyHighlight.js";

export const v2 = {
    bindActions,
    bind: bindActions,
    extractFormValues,
    resetForm,
    applyHighlight
};

export {
    bindActions,
    extractFormValues,
    resetForm,
    applyHighlight
};

export default v2;
