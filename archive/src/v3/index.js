import inputJson from "./input.json" with { type: "json" };

const renderStandaloneDom = ({ inTargetContainerId = "app" } = {}) => {
    const localTargetContainerId = inTargetContainerId;
    const container = document.getElementById(localTargetContainerId) || document.body;

    const domElements = window.ks["json-to-dom"].buildSpecElement({ inSpec: inputJson });

    if (Array.isArray(domElements)) {
        container.append(...domElements);
    } else if (domElements) {
        container.appendChild(domElements);
    }
};

renderStandaloneDom();