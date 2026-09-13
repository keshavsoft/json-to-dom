/**
 * extractInputs - Extracts input values from a container/row element
 * Collects values by element name or id.
 */
export const extractInputs = ({ inElement }) => {
    const localElement = inElement;

    if (!localElement || typeof localElement.querySelectorAll !== "function") {
        return {};
    }

    const inputs = localElement.querySelectorAll("input, select, textarea");
    const output = {};

    inputs.forEach((input) => {
        const key = input.name || input.id;
        if (!key) return;

        if (input.type === "checkbox") {
            output[key] = input.checked;
        } else if (input.type === "radio") {
            if (input.checked) {
                output[key] = input.value;
            }
        } else {
            output[key] = input.value;
        }
    });

    return output;
};

export default extractInputs;
