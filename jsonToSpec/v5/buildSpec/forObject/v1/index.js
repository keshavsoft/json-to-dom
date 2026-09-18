import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsObject }) => {
    let childrenArray = [];

    console.log("11111111--------loopObject : ", inDataAsObject);

    for (const [key, value] of Object.entries(inDataAsObject)) {
        const newTemplate = structuredClone(inTemplate);

        const createdElement = dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: { key, value }
        });

        childrenArray.push(createdElement);
    };

    return childrenArray;
};

export default startFunc;
