import columns from "./columns.json" with { type: "json" };
import config from "./config.json" with { type: "json" };
import { Form } from "../../../renderers/v2/form/Form.js";

const startFunc = () => {
    const form = new Form({
        inColumns: columns,
        inConfig: config,
        inTargetContainerId: "form-container"
    });

    const controlsTree = form.render();

    console.log("Controls Tree with IDs:", controlsTree);
};

startFunc();
