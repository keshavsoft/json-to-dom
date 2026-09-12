/**
 * Builds real DOM elements directly from a specification object or array.
 * Natively supports:
 * - spec.json format: tagName, props (className, textContent, dataset, src, alt, etc.), children
 * - standard spec format: tagName, attributes (class, ...), textContent, properties, children
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inSpec - The specification object or array of specs
 * @param {boolean} [inArgs.inApplyEvents=true] - Whether to hook events
 * @param {boolean} [inArgs.inShowLog=false] - Whether to output debug logs
 * @returns {HTMLElement|Array<HTMLElement>|null}
 */
export const buildSpecElement = ({ inSpec, inApplyEvents = true, inShowLog = false } = {}) => {
    const localSpec = inSpec;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!localSpec || typeof localSpec !== "object") return null;

    if (Array.isArray(localSpec)) {
        return localSpec
            .map((currentChildSpec) => buildSpecElement({
                inSpec: currentChildSpec,
                inApplyEvents: localApplyEvents,
                inShowLog: localShowLog
            }))
            .filter((node) => node !== null);
    }

    if (typeof localSpec.tagName !== "string" || !localSpec.tagName.trim()) {
        if (localShowLog) {
            console.warn("[json-to-dom v16] Spec missing valid tagName:", localSpec);
        }
        return null;
    }

    const localTagName = localSpec.tagName.trim().toLowerCase();

    // 0. Element Creation
    let element;
    if (localTagName === "checkbox") {
        element = document.createElement("input");
        element.type = "checkbox";
    } else {
        element = document.createElement(localTagName);
    }

    const localProps = (localSpec.props && typeof localSpec.props === "object") ? localSpec.props : null;
    const localAttributes = (localSpec.attributes && typeof localSpec.attributes === "object") ? localSpec.attributes : null;

    // 1. Apply Class
    if (localProps?.className) {
        element.className = localProps.className;
    } else if (localAttributes?.class) {
        element.className = localAttributes.class;
    } else if (Array.isArray(localSpec.classList) && localSpec.classList.length > 0) {
        element.className = localSpec.classList.join(" ");
    }

    // 2. Apply Text Content
    const localText = localSpec.textContent ?? localProps?.textContent;
    if (localText !== undefined && localText !== null) {
        element.textContent = String(localText);
    }

    // 3. Apply Dataset
    if (localProps?.dataset && typeof localProps.dataset === "object") {
        for (const [key, val] of Object.entries(localProps.dataset)) {
            if (val !== undefined && val !== null) {
                element.dataset[key] = String(val);
            }
        }
    }

    // 4. Apply Attributes from props (e.g. src, alt, href, id, title, type, etc.)
    if (localProps) {
        for (const [key, val] of Object.entries(localProps)) {
            if (key === "className" || key === "textContent" || key === "dataset") continue;
            if (val === undefined || val === null) continue;
            if (typeof val === "boolean") {
                if (val) {
                    element.setAttribute(key, "");
                } else {
                    element.removeAttribute(key);
                }
            } else {
                element.setAttribute(key, String(val));
            }
        }
    }

    // 5. Apply Attributes from attributes object
    if (localAttributes) {
        for (const [key, val] of Object.entries(localAttributes)) {
            if (key === "class") continue; // handled above
            if (val === undefined || val === null) continue;
            if (typeof val === "boolean") {
                if (val) {
                    element.setAttribute(key, "");
                } else {
                    element.removeAttribute(key);
                }
            } else {
                element.setAttribute(key, String(val));
            }
        }
    }

    // 6. Apply DOM Properties
    if (localSpec.properties && typeof localSpec.properties === "object") {
        for (const [key, val] of Object.entries(localSpec.properties)) {
            if (val !== undefined) {
                element[key] = val;
            }
        }
    }

    // 7. Apply Event Listeners
    if (localApplyEvents && localSpec.events && typeof localSpec.events === "object") {
        for (const [eventName, handler] of Object.entries(localSpec.events)) {
            if (typeof handler === "function") {
                element.addEventListener(eventName, handler);
            }
        }
    }

    // 8. Append Children
    if (Array.isArray(localSpec.children)) {
        for (const currentChildSpec of localSpec.children) {
            const childNode = buildSpecElement({
                inSpec: currentChildSpec,
                inApplyEvents: localApplyEvents,
                inShowLog: localShowLog
            });
            if (childNode) {
                if (Array.isArray(childNode)) {
                    element.append(...childNode);
                } else {
                    element.appendChild(childNode);
                }
            }
        }
    }

    return element;
};

export default buildSpecElement;
