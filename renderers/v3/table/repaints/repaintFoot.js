import { buildFoot } from "../tableBuilder/parts/buildFoot.js";

export const repaintFoot = ({ inTableElement, inColumns = [], inComputedFooter = [] } = {}) => {
    const localTableElement = inTableElement;
    const localColumns = inColumns;
    const localComputedFooter = inComputedFooter;

    if (!localTableElement) return;

    const newFootSpec = buildFoot({
        inColumns: localColumns,
        inComputedFooter: localComputedFooter
    });

    const builder = window.ks?.["json-to-dom"]?.buildSpecElement;
    if (typeof builder !== "function") return;

    const newTfoot = newFootSpec ? builder({ inSpec: newFootSpec }) : null;
    const currentTfoot = localTableElement.querySelector("tfoot");

    if (currentTfoot && newTfoot) {
        currentTfoot.replaceWith(newTfoot);
    } else if (currentTfoot && !newTfoot) {
        currentTfoot.remove();
    } else if (!currentTfoot && newTfoot) {
        localTableElement.appendChild(newTfoot);
    }
};

export default repaintFoot;
