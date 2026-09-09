import createElement from "./0.createElement.js";
import applyTextContent from "./1.applyTextContent.js";
import applyProperties from "./2.applyProperties.js";
import applyAttributes from "./3.applyAttributes.js";
import applyClassList from "./4.applyClassList.js";
import appendChildren from "./5.appendChildren.js";
import { applyEvents as defaultApplyEvents } from "../events/index.js";

const domElementBuilder = ({ inSpec, inTagDef, inClassList, inApplyEvents = false, inShowLog = false }) => {
    const localSpec = inSpec;
    const localTagDef = inTagDef;
    const localClassList = inClassList || localSpec?.classList;
    const localApplyEvents = inApplyEvents;
    const localShowLog = inShowLog;

    if (!localSpec || !localSpec.tagName) return null;

    // 0. Create Element
    const element = createElement({ inTagName: localSpec.tagName });
    if (!element) return null;

    // 1. Apply Text Content (guarded by allowsTextContent)
    applyTextContent({
        inElement: element,
        inTextContent: localSpec.textContent,
        inAllowsTextContent: localTagDef?.allowsTextContent,
        inTagName: localSpec.tagName,
        inShowLog: localShowLog
    });

    // 2. Apply Properties
    applyProperties({
        inElement: element,
        inProperties: localSpec.properties
    });

    // 3. Apply Attributes (filtered by allowedAttributes)
    applyAttributes({
        inElement: element,
        inAttributes: localSpec.attributes,
        inAllowedAttributes: localTagDef?.allowedAttributes,
        inTagName: localSpec.tagName,
        inShowLog: localShowLog
    });

    // 4. Apply ClassList (reads classList from parameter or spec)
    applyClassList({
        inElement: element,
        inClassList: localClassList
    });

    // 5. Append Children (guarded by allowsChildren)
    appendChildren({
        inElement: element,
        inChildren: localSpec.children,
        inAllowsChildren: localTagDef?.allowsChildren,
        inTagName: localSpec.tagName,
        inShowLog: localShowLog
    });

    // Optional Event Binding: Decoupled & Pluggable
    if (localApplyEvents) {
        const eventHandler = typeof localApplyEvents === "function"
            ? localApplyEvents
            : defaultApplyEvents;

        eventHandler({
            inElement: element,
            inEvents: localSpec.events,
            inTagName: localSpec.tagName,
            inShowLog: localShowLog
        });
    }

    return element;
};

export default domElementBuilder;
