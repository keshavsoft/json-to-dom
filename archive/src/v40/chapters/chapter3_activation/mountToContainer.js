/**
 * Chapter 3: Activation
 * Mounts a built DOM element or element array into a target container ID.
 * 
 * @param {Object} options
 * @param {HTMLElement|Array<HTMLElement>|Node} options.element - Element(s) to mount
 * @param {string} options.targetHtmlId - HTML ID of container
 */
const mountToContainer = ({ inElement, inTargetHtmlId, element, targetHtmlId } = {}) => {
    const localElement = inElement ?? element;
    const localTargetHtmlId = inTargetHtmlId ?? targetHtmlId;

    if (!localTargetHtmlId || typeof document === "undefined") return;

    const container = document.getElementById(localTargetHtmlId);
    if (!container) return;

    container.innerHTML = "";
    if (Array.isArray(localElement)) {
        localElement.forEach(node => {
            if (node instanceof Node) {
                container.appendChild(node);
            }
        });
    } else if (localElement instanceof Node) {
        container.appendChild(localElement);
    }
};

export default mountToContainer;
