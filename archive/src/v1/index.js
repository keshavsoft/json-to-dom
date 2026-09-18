import { buildSpecElement } from "./build/buildSpecElement.js";
import inputJson from "./input.json" with { type: "json" };

const renderStandaloneDom = ({ inTargetContainerId = "app" } = {}) => {
    const localTargetContainerId = inTargetContainerId;
    const container = document.getElementById(localTargetContainerId) || document.body;

    const domElements = buildSpecElement({ inSpec: inputJson });

    if (Array.isArray(domElements)) {
        container.append(...domElements);
    } else if (domElements) {
        container.appendChild(domElements);
    }
};

renderStandaloneDom();

export {
    renderStandaloneDom
};

export default renderStandaloneDom;
