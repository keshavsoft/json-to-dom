export const generateTableSpec = ({ inData }) => {
    const localData = inData;
    const headers = ["Vch Type", "Vch No", "Stock Item Name", "Batch Name", "Godown Name", "Amount", "Actual Qty", "Billed Qty"];

    return {
        tagName: "table",
        attributes: { class: "w-full text-left text-xs text-slate-700 divide-y divide-slate-200" },
        children: [
            {
                tagName: "thead",
                attributes: { class: "bg-slate-100 text-slate-800 uppercase font-semibold text-[11px] tracking-wider" },
                children: [
                    {
                        tagName: "tr",
                        children: headers.map(headerText => ({
                            tagName: "th",
                            textContent: headerText,
                            attributes: { class: `px-4 py-3 ${headerText === "Amount" ? "text-right" : ""}` }
                        }))
                    }
                ]
            },
            {
                tagName: "tbody",
                attributes: { class: "divide-y divide-slate-100 bg-white" },
                children: localData.map((row, idx) => ({
                    tagName: "tr",
                    attributes: { class: idx % 2 === 0 ? "hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-50" },
                    children: [
                        { tagName: "td", textContent: row.vchtype, attributes: { class: "px-4 py-3 font-medium text-slate-900" } },
                        { tagName: "td", textContent: row.vouchernumber, attributes: { class: "px-4 py-3 text-slate-600" } },
                        { tagName: "td", textContent: row.stockitemname, attributes: { class: "px-4 py-3 font-semibold text-slate-800" } },
                        { tagName: "td", textContent: row.batchname, attributes: { class: "px-4 py-3 text-slate-500 font-mono text-[11px]" } },
                        { tagName: "td", textContent: row.godownname, attributes: { class: "px-4 py-3 text-slate-600" } },
                        { tagName: "td", textContent: Number(row.amount).toFixed(2), attributes: { class: "px-4 py-3 text-right font-mono font-bold text-slate-900" } },
                        { tagName: "td", textContent: row.actualqty, attributes: { class: "px-4 py-3 text-slate-600 font-mono text-[11px]" } },
                        { tagName: "td", textContent: row.billedqty, attributes: { class: "px-4 py-3 text-slate-600 font-mono text-[11px]" } }
                    ]
                }))
            }
        ]
    };
};

export default generateTableSpec;
