import buildSpecElement from "./buildSpecElement.js";

/**
 * Renders a specification (such as spec.json) directly into a DOM target element.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inSpec - The specification object or array
 * @param {string} inArgs.inDomIdToPushTo - The target element ID
 * @param {boolean} [inArgs.inApplyEvents=true] - Whether to hook events
 * @param {boolean} [inArgs.inShowLog=false] - Whether to output debug logs
 * @returns {HTMLElement|Array<HTMLElement>|null}
 */
export const renderSpecToDom = ({
    inSpec,
    inDomIdToPushTo,
    inApplyEvents = true,
    inShowLog = false
} = {}) => {
    const localSpec = inSpec;
    const localDomIdToPushTo = inDomIdToPushTo;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    const localContainer = typeof document !== "undefined" && localDomIdToPushTo
        ? document.getElementById(localDomIdToPushTo)
        : null;

    if (localContainer) {
        localContainer.innerHTML = "";
    }

    const localDomElement = buildSpecElement({
        inSpec: localSpec,
        inApplyEvents: localApplyEvents,
        inShowLog: localShowLog
    });

    if (localContainer && localDomElement) {
        if (Array.isArray(localDomElement)) {
            localContainer.append(...localDomElement);
        } else {
            localContainer.appendChild(localDomElement);
        }
    }

    return localDomElement;
};

export default renderSpecToDom;
