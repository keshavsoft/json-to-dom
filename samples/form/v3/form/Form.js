import { buildForm } from "../formBuilder/buildForm.js";
import { pruneTreeWithIds } from "./pruneTreeWithIds.js";

export class Form {
    constructor({ columns = [], config = {}, targetContainerId = "form-container" } = {}) {
        const localColumns = columns;
        const localConfig = config;
        const localTargetContainerId = targetContainerId;

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

        return this.controlsTree;
    }

    getControlsTree() {
        return this.controlsTree;
    }
}

export default Form;
