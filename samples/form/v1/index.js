import columns from "./columns.json" with { type: "json" };
import { Form } from "./form/Form.js";

const startFunc = () => {
    const form = new Form({
        columns,
        targetContainerId: "form-container"
    });

    form.render();
};

startFunc();
