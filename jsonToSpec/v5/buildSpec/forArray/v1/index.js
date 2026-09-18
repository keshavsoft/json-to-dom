import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsArray }) => {
    const childrenArray = inDataAsArray.map(element => {
        const newTemplate = structuredClone(inTemplate);

        const createdElement = dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: element
        });

        return createdElement;
    });

    return childrenArray;
};

export default startFunc;
