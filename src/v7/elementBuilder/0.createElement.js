export const createElement = ({ inTagName }) => {
    const localTagName = inTagName?.toLowerCase();
    if (localTagName === "checkbox") {
        const inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        return inputElement;
    }
    return document.createElement(localTagName);
};

export default createElement;
