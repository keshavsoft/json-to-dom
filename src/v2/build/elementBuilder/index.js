import createElement from "./createElement.js";
import applyTextContent from "./applyTextContent.js";
import applyProperties from "./applyProperties.js";
import applyAttributes from "./applyAttributes.js";
import applyClassList from "./applyClassList.js";
import applyEvents from "./applyEvents.js";
import appendChildren from "./appendChildren.js";

const startFunc = ({ inSpec, inClassList }) => {
    const localSpec = inSpec;
    const localClassList = inClassList;

    if (!localSpec || !localSpec.tagName) return null;

    // 1. Create Element
    const element = createElement({ inTagName: localSpec.tagName });

    // 2. Apply Text Content & Properties
    applyTextContent({ inElement: element, inTextContent: localSpec.textContent });
    applyProperties({ inElement: element, inProperties: localSpec.properties });

    // 3. Apply Attributes & Classes
    applyAttributes({ inElement: element, inAttributes: localSpec.attributes });
    applyClassList({ inElement: element, inClassList: localClassList });

    // 4. Bind Event Listeners
    applyEvents({ inElement: element, inEvents: localSpec.events, inTagName: localSpec.tagName });

    // 5. Append Children
    appendChildren({ inElement: element, inChildren: localSpec.children });

    return element;
};

export default startFunc;
