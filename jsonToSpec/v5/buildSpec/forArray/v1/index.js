import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsArray }) => {
    const localDataAsArray = inDataAsArray;
    const localTemplate = inTemplate;
    // console.log("forArray : ", localTemplate, localDataAsArray);

    const childrenArray = localDataAsArray.map(element => {
        const newTemplate = structuredClone(localTemplate);

        const createdElement = dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: element
        });

        return createdElement;
    });

    return childrenArray;
};

export default startFunc;
