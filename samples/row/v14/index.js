import specJson from "./spec.json" with { type: "json" };
import dataJson from "./data.json" with { type: "json" };

const startFunc = async () => {
    try {
        // const spec = await fetch("./spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node
        const jsonSpec = window.ks['json-to-spec'].buildSpecElement({
            specJson, dataJson
        });

        const k2 = window.ks['json-to-dom'].buildSpecElement({
            spec: jsonSpec,
            domIdToPushTo: "tbody",
            output: { type: "dom" }
        });


        console.log("kkkkkkkkkk : ", jsonSpec);

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
