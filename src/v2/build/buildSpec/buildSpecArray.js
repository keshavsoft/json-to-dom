import buildSpecElement from "../buildSpecElement.js";

export const buildSpecArray = ({ inSpec }) => {
    const localSpec = inSpec;
    return localSpec.map(item => buildSpecElement(item)).flat().filter(Boolean);
};

export default buildSpecArray;
