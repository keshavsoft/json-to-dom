import spec from "./spec.json" with { type: "json" };

const startFunc = () => {
    // Pure HTML DOM Builder: JSON in -> Native DOM out (zero event hooks)
    window.ks['json-to-dom'].specToDom({
        inSpec: spec,
        inDomIdToPushTo: "table-container"
    });
};

startFunc();
