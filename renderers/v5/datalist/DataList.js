import { buildDataList } from "./datalistBuilder/buildDataList.js";
import { buildOptions } from "./datalistBuilder/parts/buildOptions.js";

export class DataList {
    constructor({ inData = [], inColumns = [], inTargetContainerId = "datalist-container", inTopN = 100, data, columns, targetContainerId, topN } = {}) {
        const localData = inData || data || [];
        const localColumns = inColumns || columns || [];
        const localTargetContainerId = inTargetContainerId || targetContainerId || "datalist-container";
        const localTopN = inTopN ?? topN ?? 100;

        this.data = localData;
        this.columns = localColumns;
        this.containerId = localTargetContainerId;
        this.topN = localTopN;
        this.element = null;
        this.spec = null;
    }

    render() {
        if (typeof document === "undefined") return null;

        let container = document.getElementById(this.containerId);
        if (!container) {
            container = document.createElement("div");
            container.id = this.containerId;
            document.body.appendChild(container);
        }

        const dataListSpec = buildDataList({
            inData: this.data,
            inColumns: this.columns,
            inTopN: this.topN
        });

        this.spec = dataListSpec;

        const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
        let domElement = null;

        if (typeof builder === "function") {
            const built = builder({ inSpec: dataListSpec });
            domElement = Array.isArray(built) ? built[0] : built;
        }

        // Reliable fallback if builder did not produce datalist children
        if (!domElement || domElement.children.length === 0) {
            const wrapper = document.createElement("div");
            wrapper.id = "ks-datalists-wrapper";

            for (const col of this.columns) {
                const key = col.key || "";
                const datalistId = col.datalistId || `${key}-datalist`;
                const datalist = document.createElement("datalist");
                datalist.id = datalistId;

                const options = buildOptions({
                    inData: this.data,
                    inKey: key,
                    inTopN: this.topN
                });

                for (const opt of options) {
                    const optionEl = document.createElement("option");
                    optionEl.value = opt.attributes.value;
                    optionEl.label = opt.attributes.label;
                    optionEl.textContent = opt.textContent;
                    datalist.appendChild(optionEl);
                }

                wrapper.appendChild(datalist);
            }
            domElement = wrapper;
        }

        this.element = domElement;

        container.innerHTML = "";
        if (this.element) {
            container.appendChild(this.element);
        }

        return {
            spec: this.spec,
            element: this.element
        };
    }

    update({ inData = [] } = {}) {
        const localData = inData;
        this.data = localData;
        return this.render();
    }
}

export default DataList;
