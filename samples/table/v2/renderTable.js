import { buildSpecElement } from "../../../src/v3/build/buildSpecElement.js";

export const renderTable = ({ inSpec, inTargetContainerId = "table-container" } = {}) => {
    const localSpec = inSpec;
    const localTargetContainerId = inTargetContainerId;
    const container = document.getElementById(localTargetContainerId);

    if (!container) return;

    const builder = buildSpecElement || window.ks?.["json-to-dom"]?.buildSpecElement;
    const domElement = builder({ inSpec: localSpec });

    if (Array.isArray(domElement)) {
        container.append(...domElement);
    } else if (domElement) {
        container.appendChild(domElement);
    }
};

export default renderTable;
