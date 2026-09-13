import attachRowListener from "./row/attachRowListener.js";
import getClosestTarget from "./row/getClosestTarget.js";
import applyHighlight from "./row/applyHighlight.js";
import extractOutput from "./row/extractOutput.js";

export const listeners = {
    attachRowListener,
    row: {
        attachRowListener,
        getClosestTarget,
        applyHighlight,
        extractOutput
    }
};

export {
    attachRowListener,
    getClosestTarget,
    applyHighlight,
    extractOutput
};

export default listeners;
