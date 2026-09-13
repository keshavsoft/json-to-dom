import spec from "./spec.json" with { type: "json" };

const startFunc = () => {
    window.ks['json-to-dom'].specToDom({ spec, domIdToPushTo: "table-container" });
    addListeners();
};

const addListeners = () => {
    const button = document.getElementById("saveButton");

    button.addEventListener("click", (event) => {
        const localCurrentTarget = event.currentTarget;
        console.log("Button clicked : ", event.output);
    });
};

startFunc();
