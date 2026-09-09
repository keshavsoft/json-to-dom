import handleButtonClick from "./buttonClick/index.js";

export const attachInternalEvents = ({ inElement, inTagName }) => {
    const localElement = inElement;
    const localTagName = inTagName?.toLowerCase();

    if (!localElement) return localElement;

    // Attach native button internal click hook
    if (localTagName === "button") {
        localElement.addEventListener("click", (event) => {
            handleButtonClick({ inEvent: event });
        });
    }

    return localElement;
};

export default attachInternalEvents;
