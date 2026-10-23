import render from "../../../docs/dist/v42/min.js";

import table from "./table.json" with { type: "json" };

const start = () => {
  try {
    const createControl = render({
      jsonSpec: table,
      targetHtmlId: "dom-render-container",
      appendPosition: "append",
      showLog: true
    });
  } catch (err) {
    console.log("error:", err);
  }
};

start();