import spec from "./spec.json" with { type: "json" };

const startFunc = () => {
    window.ks['json-to-dom'].specToDom({ spec, domIdToPushTo: "table-container" });
};

startFunc();
