import buildSpecElement from "../index.js";

export const buildSpecArray = ({ inSpec }) => {
    const localSpec = inSpec;
    return localSpec.map(item => buildSpecElement(item)).flat().filter(Boolean);
};

export default buildSpecArray;
