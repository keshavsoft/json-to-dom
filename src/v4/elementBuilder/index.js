import createElement from "./0.createElement.js";
import applyTextContent from "./1.applyTextContent.js";
import applyProperties from "./2.applyProperties.js";
import applyAttributes from "./3.applyAttributes.js";
import applyClassList from "./4.applyClassList.js";
import applyEvents from "./5.applyEvents.js";
import appendChildren from "./6.appendChildren.js";

const startFunc = ({ inSpec, inClassList }) => {
    const localSpec = inSpec;
    const localClassList = inClassList;

    if (!localSpec || !localSpec.tagName) return null;

    // 0. Create Element
    const element = createElement({ inTagName: localSpec.tagName });

    // 1. Apply Text Content
    applyTextContent({ inElement: element, inTextContent: localSpec.textContent });

    // 2. Apply Properties
    applyProperties({ inElement: element, inProperties: localSpec.properties });

    // 3. Apply Attributes
    applyAttributes({ inElement: element, inAttributes: localSpec.attributes });

    // 4. Apply ClassList
    applyClassList({ inElement: element, inClassList: localClassList });

    // 5. Bind Event Listeners
    applyEvents({ inElement: element, inEvents: localSpec.events });

    // 6. Append Children
    appendChildren({ inElement: element, inChildren: localSpec.children });

    return element;
};

export default startFunc;
