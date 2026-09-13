import extractFormValues from "./extractFormValues.js";
import resetForm from "./resetForm.js";
import applyHighlight from "./applyHighlight.js";

/**
 * bindActions - Form-Level & Footer Action Event Delegation (v2)
 *
 * Catches button clicks declaring `data-action="..."`.
 * Supports both:
 * 1. Form-scoped actions (e.g. Save, Cancel at the form footer):
 *    Extracts values across the ENTIRE form, provides reset() helper.
 * 2. Row-scoped actions (with data-closest-target="ksrow"):
 *    Extracts values only within the active row and applies row highlights.
 *
 * Clean public API:
 * { container, containerId, form, formId, actions = {}, defaultValues = {}, showLog = false }
 * Internal convention:
 * { inContainer, inContainerId, inForm, inFormId, inActions, inDefaultValues, inShowLog }
 */
export const bindActions = (inArgs = {}) => {
    const localArgs = inArgs;

    const localContainer = localArgs.container
        || localArgs.form
        || localArgs.inContainer
        || localArgs.inForm
        || (typeof document !== "undefined" && (localArgs.containerId || localArgs.formId || localArgs.inContainerId || localArgs.inFormId)
            ? document.getElementById(localArgs.containerId || localArgs.formId || localArgs.inContainerId || localArgs.inFormId)
            : null);

    const localActions = localArgs.actions || localArgs.inActions || {};
    const localDefaults = localArgs.defaultValues || localArgs.inDefaultValues || {};
    const localShowLog = Boolean(localArgs.showLog ?? localArgs.inShowLog);

    if (!localContainer) {
        if (localShowLog) {
            console.warn("[json-to-dom listeners.v2] bindActions: Container/Form not found.");
        }
        return { remove: () => {} };
    }

    const clickHandler = (event) => {
        const actionElement = event.target?.closest?.("[data-action]");
        if (!actionElement) return;

        const actionName = actionElement.dataset.action;
        const handler = localActions[actionName];
        const isRowScoped = actionElement.dataset.closestTarget === "ksrow"
            || actionElement.dataset.scope === "row";

        let rowElement = null;
        let formElement = null;
        let values = {};

        if (isRowScoped) {
            const targetClass = actionElement.dataset.closestTarget || "ksrow";
            rowElement = actionElement.closest(`.${targetClass}`) || actionElement.parentElement;
            if (rowElement) {
                applyHighlight({
                    inTargetElement: actionElement,
                    inClosestElement: rowElement,
                    inContainerElement: localContainer
                });
                values = extractFormValues({ inElement: rowElement });
            }
        } else {
            // Form footer / Form-wide action scope
            formElement = actionElement.closest("form") || actionElement.closest(".ksform") || localContainer;
            values = extractFormValues({ inElement: formElement });
        }

        const resetHelper = () => {
            const targetElement = formElement || localContainer;
            return resetForm({
                inElement: targetElement,
                inDefaultValues: localDefaults
            });
        };

        if (localShowLog) {
            console.log(`[json-to-dom listeners.v2] Action triggered: "${actionName}"`, {
                target: actionElement,
                scope: isRowScoped ? "row" : "form",
                row: rowElement,
                form: formElement,
                values
            });
        }

        // Auto-reset on cancel or reset if no custom handler is registered
        if ((actionName === "cancel" || actionName === "reset") && typeof handler !== "function") {
            resetHelper();
            return;
        }

        // Execute action callback if registered
        if (typeof handler === "function") {
            handler({
                event,
                target: actionElement,
                row: rowElement,
                form: formElement || localContainer,
                values,
                reset: resetHelper,
                container: localContainer
            });
        } else if (localShowLog) {
            console.warn(`[json-to-dom listeners.v2] No handler registered for action "${actionName}".`);
        }
    };

    localContainer.addEventListener("click", clickHandler);

    return {
        remove: () => {
            localContainer.removeEventListener("click", clickHandler);
        }
    };
};

export default bindActions;
