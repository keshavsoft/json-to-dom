import normalizeInput from "./orchestration/1.normalizeInput.js";
import dispatchSpec from "./orchestration/2.dispatchSpec.js";
import registerGlobal from "./orchestration/3.registerGlobal.js";

import meta from "./meta.js";
import applyEvents, { getHookedEvents } from "./events/index.js";
import validate from "./validate/index.js";
import data from "./data/index.js";
import blues from "./blues.js";

/**
 * Core Declarative DOM Builder (v12)
 *
 * Story by keys:
 *   tree  → full hierarchical API (core · events · validate · data · meta)
 *   blues → validation & reference data (the guardrails)
 *
 * Orchestration:
 *   Step 1 → Normalize input arguments & configuration
 *   Step 2 → Dispatch to DOM builder pipeline
 *   Step 3 → Register API to global environment
 */

// ── core builders ──────────────────────────────────────────────

const buildSpecElement = (inArgs) => {
    const localArgs = inArgs;
    const { spec, applyEvents: localApplyEvents, showLog } = normalizeInput({ inArgs: localArgs });
    return dispatchSpec({ inSpec: spec, inApplyEvents: localApplyEvents, inShowLog: showLog });
};

const buildSpecElementWithEvents = ({ inSpec, inShowLog = false } = {}) => {
    return buildSpecElement({ inSpec, inApplyEvents: true, inShowLog });
};

const appendToDom = ({ domSpecAsJson, domIdToPushTo }) => {
    const container = document.getElementById(domIdToPushTo);
    const domElement = buildSpecElement({ inSpec: domSpecAsJson });

    if (Array.isArray(domElement)) {
        container.append(...domElement);
    } else if (domElement) {
        container.appendChild(domElement);
    };
};

// ── tree  (assembled from folders) ─────────────────────────────

export const tree = {
    meta,
    core: { buildSpecElement, buildSpecElementWithEvents, appendToDom },
    events: { applyEvents, getHookedEvents },
    validate,
    data
};

export { blues };

// ── Step 3: Register API to global environment ─────────────────

registerGlobal({ inApi: { ...tree, buildSpecElement, appendToDom } });

export default buildSpecElement;