import createElement from "./0.createElement.js";
import applyTextContent from "./1.applyTextContent.js";
import applyProperties from "./2.applyProperties.js";
import applyAttributes from "./3.applyAttributes.js";
import applyClassList from "./4.applyClassList.js";
import applyEvents from "./5.applyEvents.js";
import appendChildren from "./6.appendChildren.js";

const startFunc = ({ inSpec, inTagDef, inClassList, inShowLog = false }) => {
    const localSpec = inSpec;
    const localTagDef = inTagDef;
    const localClassList = inClassList;
    const localShowLog = inShowLog;

    if (!localSpec || !localSpec.tagName) return null;

    // 0. Create Element
    const element = createElement({ inTagName: localSpec.tagName });

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

    // 4. Apply ClassList
    applyClassList({
        inElement: element,
        inClassList: localClassList
    });

    // 5. Bind Event Listeners
    applyEvents({
        inElement: element,
        inEvents: localSpec.events
    });

    // 6. Append Children (guarded by allowsChildren)
    appendChildren({
        inElement: element,
        inChildren: localSpec.children,
        inAllowsChildren: localTagDef?.allowsChildren,
        inTagName: localSpec.tagName,
        inShowLog: localShowLog
    });

    return element;
};

export default startFunc;
