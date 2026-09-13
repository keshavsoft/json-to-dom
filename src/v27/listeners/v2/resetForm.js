/**
 * resetForm - Resets all form fields inside a form or container element
 *
 * Supports restoring to optional initial defaultValues, or blanking out.
 */
export const resetForm = (inArgs = {}) => {
    const localArgs = inArgs;
    const localElement = localArgs.element
        || localArgs.form
        || localArgs.container
        || localArgs.inElement
        || localArgs.inForm
        || localArgs.inContainer;

    const localDefaults = localArgs.defaultValues || localArgs.inDefaultValues || {};

    if (!localElement || typeof localElement.querySelectorAll !== "function") {
        return { success: false };
    }

    if (localElement.tagName === "FORM" && typeof localElement.reset === "function" && Object.keys(localDefaults).length === 0) {
        localElement.reset();
        return { success: true };
    }

    const fields = localElement.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
        const key = field.name || field.id;
        const type = (field.type || "").toLowerCase();

        if (type === "button" || type === "submit" || type === "reset" || field.tagName === "BUTTON") {
            return;
        }

        const defaultValue = key && key in localDefaults ? localDefaults[key] : null;

        if (type === "checkbox") {
            field.checked = defaultValue !== null ? Boolean(defaultValue) : false;
        } else if (type === "radio") {
            field.checked = defaultValue !== null ? field.value === defaultValue : false;
        } else if (field.tagName === "SELECT") {
            if (defaultValue !== null) {
                field.value = defaultValue;
            } else if (field.options && field.options.length > 0) {
                field.selectedIndex = 0;
            } else {
                field.value = "";
            }
        } else {
            field.value = defaultValue !== null ? String(defaultValue) : "";
        }
    });

    return { success: true };
};

export default resetForm;
