export const buildField = ({ inColumn = {} } = {}) => {
    const localColumn = inColumn;

    const key = localColumn.key || "";
    const labelText = localColumn.label || key;
    const inputType = localColumn.type === "number" ? "number" : "text";

    const labelNode = {
        tagName: "label",
        textContent: labelText,
        attributes: {
            class: "block text-sm font-semibold text-slate-700"
        }
    };

    const inputNode = {
        tagName: "input",
        attributes: {
            type: inputType,
            name: key,
            placeholder: `Enter ${labelText}...`,
            class: "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        }
    };

    // Only assign ID if explicitly passed in columns.json
    if (localColumn.id) {
        inputNode.attributes.id = localColumn.id;
        labelNode.attributes.for = localColumn.id;
    }

    return {
        tagName: "div",
        attributes: {
            class: "grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center py-2.5 border-b border-slate-100 last:border-0"
        },
        children: [
            labelNode,
            {
                tagName: "div",
                attributes: { class: "sm:col-span-3" },
                children: [inputNode]
            }
        ]
    };
};

export default buildField;
