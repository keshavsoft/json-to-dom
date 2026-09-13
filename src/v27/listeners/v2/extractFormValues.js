/**
 * extractFormValues - Extracts all input, select, and textarea values from a form or container
 *
 * Scans across all rows and child elements, collecting data by name or id.
 * Supports:
 * - Text, number, date, email inputs
 * - Checkboxes (boolean or array if multiple share same name)
 * - Radio groups (selected value)
 * - Select dropdowns (single and multiple)
 * - Textarea fields
 */
export const extractFormValues = (inArgs = {}) => {
    const localArgs = inArgs;
    const localElement = localArgs.element
        || localArgs.form
        || localArgs.container
        || localArgs.inElement
        || localArgs.inForm
        || localArgs.inContainer;

    if (!localElement || typeof localElement.querySelectorAll !== "function") {
        return {};
    }

    const fields = localElement.querySelectorAll("input, select, textarea");
    const output = {};

    // Count checkboxes by key to distinguish single boolean from multi-checkbox array
    const checkboxCounts = {};
    fields.forEach((field) => {
        if ((field.type || "").toLowerCase() === "checkbox") {
            const k = field.name || field.id;
            if (k) checkboxCounts[k] = (checkboxCounts[k] || 0) + 1;
        }
    });

    fields.forEach((field) => {
        const key = field.name || field.id;
        if (!key) return;

        // Do not extract buttons or submit/reset inputs
        const type = (field.type || "").toLowerCase();
        if (type === "button" || type === "submit" || type === "reset" || field.tagName === "BUTTON") {
            return;
        }

        if (type === "checkbox") {
            if (checkboxCounts[key] > 1) {
                if (!Array.isArray(output[key])) {
                    output[key] = [];
                }
                if (field.checked) {
                    output[key].push(field.value);
                }
            } else {
                output[key] = field.checked;
            }
        } else if (type === "radio") {
            if (field.checked) {
                output[key] = field.value;
            } else if (!(key in output)) {
                output[key] = null;
            }
        } else if (field.tagName === "SELECT" && field.multiple) {
            const selectedOptions = Array.from(field.selectedOptions || []).map(opt => opt.value);
            output[key] = selectedOptions;
        } else {
            output[key] = field.value;
        }
    });

    return output;
};

export default extractFormValues;
