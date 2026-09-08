import spec from "./spec.json" with { type: "json" };
import { renderTable } from "./renderTable.js";

const startFunc = () => {
    const tableSpec = spec;
    renderTable({ inSpec: tableSpec, inTargetContainerId: "table-container" });

    // Grab hold of only that button
    const saveButton = document.getElementById("saveButton");

    if (saveButton) {
        saveButton.addEventListener("click", (event) => {
            console.log("[Outside listener] event.output:", event.output);
            alert(`Outside received from button click:\nName: ${event.output?.name}\nValue: ${event.output?.value}`);
        });
    }
};

startFunc();
