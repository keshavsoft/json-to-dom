import { buildForm } from "../formBuilder/buildForm.js";

export class Form {
    constructor({ columns = [], config = {}, targetContainerId = "form-container" } = {}) {
        const localColumns = columns;
        const localConfig = config;
        const localTargetContainerId = targetContainerId;

        this.columns = localColumns;
        this.config = localConfig;
        this.containerId = localTargetContainerId;
        this.formElement = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const formSpec = buildForm({
            inColumns: this.columns,
            inConfig: this.config
        });

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        if (typeof builder !== "function") {
            console.error("json-to-dom buildSpecElement not found on window.ks");
            return;
        }

        const domElement = builder({ inSpec: formSpec });
        this.formElement = Array.isArray(domElement) ? domElement[0] : domElement;

        container.innerHTML = "";
        container.appendChild(this.formElement);
    }
}

export default Form;
