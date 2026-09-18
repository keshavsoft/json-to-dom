export const extractOutput = ({ inClosestElement }) => {
    const localClosestElement = inClosestElement;
    if (!localClosestElement) {
        return {
            name: undefined,
            value: undefined,
            input: null,
            inputs: [],
            values: {},
            closestElement: null
        };
    }

    const inputs = Array.from(localClosestElement.querySelectorAll("input, select, textarea"));
    const values = {};

    inputs.forEach(element => {
        if (element.name) {
            values[element.name] = element.type === "checkbox"
                ? element.checked
                : element.value;
        }
    });

    const primaryInput = inputs[0] || null;

    return {
        name: primaryInput?.name,
        value: primaryInput?.value,
        input: primaryInput,
        inputs,
        values,
        closestElement: localClosestElement
    };
};

export default extractOutput;
