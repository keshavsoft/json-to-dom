import spec from "./spec.json" with { type: "json" };
import data from "./data.json" with { type: "json" };

const startFunc = async () => {
    try {
        // const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node
        const jsonSpec = window.ks['json-to-spec'].buildSpecElement({
            spec,
            domIdToPushTo: "form-container",
            output: { type: "spec", data }
        });

        const k2 = window.ks['json-to-dom'].buildSpecElement({
            spec: jsonSpec,
            domIdToPushTo: "form-container",
            output: { type: "dom" }
        });


        console.log("kkkkkkkkkk : ", k2);

        // window.ks['json-to-dom'].buildSpecElement({
        //     spec,
        //     domIdToPushTo: "form-container",
        //     output: { type: "dom" }
        // });

    } catch (err) {
        console.error("Failed to render v27 sample:", err);
    }
};

startFunc();
