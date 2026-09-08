import isEventAllowed from "../validate/isEventAllowed.js";

// Local test handler: extracts data and attaches it to event.output
const localButtonClick = (event) => {
    const currentTarget = event.currentTarget;
    const dataset = currentTarget.dataset;
    const dataClosestTarget = dataset.closestTarget;
    const closestElement = dataClosestTarget ? currentTarget.closest(`.${dataClosestTarget}`) : null;
    console.log("jjjjjjjjjj", closestElement, dataset);

    if (dataset.highlight === "true" && dataset.highlightClass) {

        const classes = dataset.highlightClass.split(" ").filter(Boolean);
        console.log("jjjjjjjjjj---", classes);
        closestElement.classList.add(...classes);
    }

    // bg - primary bg - opacity - 10 rounded border border - primary border - opacity - 25

    const input = closestElement ? closestElement.querySelector("input") : null;

    const name = input?.name;
    const value = input?.value;

    event.output = {
        name,
        value,
        input,
        closestElement
    };

    // console.log("[json-to-dom] Internal button click, attached event.output:", event.output);
};

export const applyEvents = ({ inElement, inEvents, inTagName, inShowLog = false }) => {
    const localElement = inElement;
    const localEvents = inEvents;
    const localTagName = inTagName;
    const localShowLog = inShowLog;

    // 1. Hook internal handler directly on button elements
    if (localTagName === "button") {
        localElement.addEventListener("click", localButtonClick);
    }

    if (!localEvents || typeof localEvents !== "object") return localElement;

    // 2. Hook any spec-declared events
    Object.entries(localEvents).forEach(([eventName, listener]) => {
        if (isEventAllowed({ inTagName: localTagName, inEventName: eventName })) {
            localElement.addEventListener(eventName, listener);
        } else if (localShowLog) {
            console.warn(`[json-to-dom] Event "${eventName}" is not permitted on <${localTagName}>; discarded.`);
        }
    });

    return localElement;
};

export default applyEvents;
