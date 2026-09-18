let globalCatalog = null;

const startFunc = async () => {
    try {
        // Fetch the single consolidated specs catalog
        globalCatalog = await fetch("./specs.json").then(res => res.json());
        console.log("[Hybrid Test] Loaded consolidated specs catalog:", globalCatalog);

        // 1. Build and Render the Assembled Hybrid Control (Toolbar + Table + Form)
        renderHybridDashboard();

        // 2. Setup the Dynamic Component Switcher (Select any spec from the catalog)
        setupComponentSwitcher();

    } catch (err) {
        console.error("Failed to initialize hybrid catalog test:", err);
    }
};

/**
 * Proof 1: Compose a larger Hybrid Control from multiple components in specs.json
 */
const renderHybridDashboard = () => {
    // Compose: Search Toolbar + Table with Actions + Form with Footer Actions
    const hybridCompositeSpec = [
        ...globalCatalog.row.horizontalInline,
        {
            tagName: "div",
            attributes: { class: "my-3" },
            children: []
        },
        ...globalCatalog.table.withRowActions,
        {
            tagName: "div",
            attributes: { class: "my-3" },
            children: []
        },
        ...globalCatalog.form.footerActions
    ];

    // Render pure DOM node into #hybrid-container
    window.ks['json-to-dom'].specToDom({
        spec: hybridCompositeSpec,
        domIdToPushTo: "hybrid-container"
    });

    // Hook unified listeners for all composed components
    window.ks['json-to-dom'].listeners.bindActions({
        containerId: "hybrid-container",
        actions: {
            applyFilter: ({ values }) => {
                updateEventBadge('Toolbar "applyFilter" Fired!', 'bg-info text-dark');
                updateEventBox({
                    source: "row.horizontalInline",
                    action: "applyFilter",
                    timestamp: new Date().toLocaleTimeString(),
                    criteria: values
                });
            },
            selectRow: ({ values, row }) => {
                updateEventBadge(`Table "selectRow" Fired (${values.voucherNo})!`, 'bg-primary');
                updateEventBox({
                    source: "table.withRowActions",
                    action: "selectRow",
                    timestamp: new Date().toLocaleTimeString(),
                    selectedRecord: values
                });

                // Auto-fill the form with the selected table record!
                const voucherInput = document.querySelector('#hybrid-container input[name="voucherNumber"]');
                const partyInput = document.querySelector('#hybrid-container input[name="partyName"]');
                if (voucherInput && values.voucherNo) voucherInput.value = values.voucherNo;
                if (partyInput && values.partyName) partyInput.value = values.partyName;
            },
            save: ({ values }) => {
                updateEventBadge('Footer "save" Fired! Full Form Extracted', 'bg-success');
                updateEventBox({
                    source: "form.footerActions",
                    action: "save",
                    timestamp: new Date().toLocaleTimeString(),
                    totalFields: Object.keys(values).length,
                    formData: values
                });
            },
            cancel: ({ reset }) => {
                reset();
                updateEventBadge('Footer "cancel" Fired! Form Cleared', 'bg-warning text-dark');
                updateEventBox({
                    source: "form.footerActions",
                    action: "cancel",
                    timestamp: new Date().toLocaleTimeString(),
                    status: "Form reset to blank"
                });
            }
        }
    });

    // Display composition code snippet
    const codeSnippetBox = document.getElementById("composition-code-box");
    if (codeSnippetBox) {
        codeSnippetBox.textContent = `// Composed from single specs.json:
const hybridSpec = [
    ...specs.row.horizontalInline,   // Filter Toolbar
    ...specs.table.withRowActions,   // Data Table
    ...specs.form.footerActions      // Detail Form
];

window.ks['json-to-dom'].specToDom({
    spec: hybridSpec,
    domIdToPushTo: "hybrid-container"
});`;
    }
};

/**
 * Proof 2: Dynamic Catalog Picker — Render any component from specs.json by key
 */
const setupComponentSwitcher = () => {
    const selectEl = document.getElementById("catalog-picker-select");
    if (!selectEl) return;

    const renderSelectedComponent = (keyPath) => {
        const [group, name] = keyPath.split(".");
        const selectedSpec = globalCatalog?.[group]?.[name];
        if (!selectedSpec) return;

        const container = document.getElementById("catalog-preview-container");
        if (container) container.innerHTML = "";

        window.ks['json-to-dom'].specToDom({
            spec: selectedSpec,
            domIdToPushTo: "catalog-preview-container"
        });

        // Show JSON tree preview
        const jsonPreview = document.getElementById("catalog-json-preview");
        if (jsonPreview) {
            jsonPreview.textContent = JSON.stringify(selectedSpec, null, 2);
        }
    };

    selectEl.addEventListener("change", (e) => {
        renderSelectedComponent(e.target.value);
    });

    // Initial render
    renderSelectedComponent(selectEl.value || "row.withActionButtons");
};

const updateEventBadge = (text, badgeClass) => {
    const badge = document.getElementById("hybrid-status-badge");
    if (badge) {
        badge.className = `badge ${badgeClass}`;
        badge.textContent = text;
    }
};

const updateEventBox = (data) => {
    const box = document.getElementById("hybrid-event-box");
    if (box) {
        box.textContent = JSON.stringify(data, null, 2);
    }
};

startFunc();
