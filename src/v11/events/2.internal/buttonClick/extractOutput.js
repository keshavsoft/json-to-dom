export const extractOutput = ({ inClosestElement }) => {
    const localClosestElement = inClosestElement;
    if (!localClosestElement) {
        return {
            name: undefined,
            value: undefined,
            input: null,
            closestElement: null
        };
    }

    const input = localClosestElement.querySelector("input");
    return {
        name: input?.name,
        value: input?.value,
        input,
        closestElement: localClosestElement
    };
};

export default extractOutput;
