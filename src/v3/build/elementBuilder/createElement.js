export const createElement = ({ inTagName }) => {
    const localTagName = inTagName;
    return document.createElement(localTagName);
};

export default createElement;
