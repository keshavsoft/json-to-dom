import { buildHead } from "./parts/buildHead.js";
import { buildBody } from "./parts/buildBody.js";
import { buildFoot } from "./parts/buildFoot.js";

export const buildForm = ({ inColumns = [], inConfig = {} } = {}) => {
    const localColumns = inColumns;
    const localConfig = inConfig;

    const head = buildHead({ inHeadConfig: localConfig?.head });
    const body = buildBody({ inColumns: localColumns });
    const foot = buildFoot({ inFootConfig: localConfig?.foot });

    return {
        tagName: "div",
        attributes: {
            class: "bg-white p-6 rounded-lg border border-slate-200 shadow-sm max-w-2xl mx-auto"
        },
        children: [head, body, foot].filter(Boolean)
    };
};

export default buildForm;
