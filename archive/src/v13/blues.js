/**
 * blues — validation & reference guardrails (flat access)
 */
import validate from "./validate/index.js";
import data from "./data/index.js";

export const blues = {
    ...validate,
    ...data
};

export default blues;
