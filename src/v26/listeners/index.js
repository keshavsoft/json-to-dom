/**
 * listeners — Dedicated Event Hooking & Delegation Engine (v26)
 * Decoupled from the DOM builder. Hooks actions to rendered DOM via container delegation.
 */
import bindActions from "./bindActions.js";
import extractInputs from "./extractInputs.js";
import applyHighlight from "./applyHighlight.js";

export const listeners = {
    bindActions,
    bind: bindActions,
    extractInputs,
    applyHighlight
};

export {
    bindActions,
    extractInputs,
    applyHighlight
};

export default listeners;
