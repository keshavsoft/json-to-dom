import { buildForm } from "./formBuilder/buildForm.js";
import { pruneTreeWithIds } from "../common/pruneTreeWithIds.js";

export class Form {
    constructor({ inColumns = [], inConfig = {}, inTargetContainerId = "form-container", columns, config, targetContainerId } = {}) {
        const localColumns = inColumns || columns || [];
        const localConfig = inConfig || config || {};
        const localTargetContainerId = inTargetContainerId || targetContainerId || "form-container";

        this.columns = localColumns;
        this.config = localConfig;
        this.containerId = localTargetContainerId;
        this.formElement = null;
        this.controlsTree = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return null;

        const formSpec = buildForm({
            inColumns: this.columns,
            inConfig: this.config
        });

        // Extract pruned tree with controls having IDs only
        this.controlsTree = pruneTreeWithIds({ inSpec: formSpec });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        if (typeof builder !== "function") {
            console.error("json-to-dom buildSpecElement not found on window.ks");
            return this.controlsTree;
        }

        const domElement = builder({ inSpec: formSpec });
        this.formElement = Array.isArray(domElement) ? domElement[0] : domElement;

        container.innerHTML = "";
        container.appendChild(this.formElement);

        return {
            treeWithIds: this.controlsTree,
            spec: formSpec,
            element: this.formElement
        };
    };

    getControlsTree() {
        return this.controlsTree;
    }
}

export default Form;
