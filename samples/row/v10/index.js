const startFunc = async () => {
    try {
        const spec = await fetch("/samples/row/v10/spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node (Clean API without 'in' prefix, zero validation overhead)
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        // 2. Output 2: Static HTML String (Clean API without 'in' prefix)
        const htmlString = window.ks['json-to-dom'].specToHtml({
            spec
        });

        const outputBox = document.getElementById("html-output-box");
        if (outputBox) {
            outputBox.textContent = htmlString;
        }

        // 3. Standalone Validation Call: window.ks['json-to-dom'].validate
        const validationReports = Array.isArray(spec)
            ? spec.map(item => window.ks['json-to-dom'].validate({ spec: item }))
            : [window.ks['json-to-dom'].validate({ spec })];

        const allValid = validationReports.every(r => r.isValid);
        const validationBadge = document.getElementById("validation-badge");
        if (validationBadge) {
            validationBadge.className = allValid ? "badge bg-success" : "badge bg-danger";
            validationBadge.textContent = allValid ? "Valid Spec (100% W3C Compliant)" : "Validation Errors";
        }

        const validationBox = document.getElementById("validation-output-box");
        if (validationBox) {
            validationBox.textContent = JSON.stringify(validationReports, null, 2);
        }

        // 4. Test Invalid Spec validation
        const invalidSpec = {
            tagName: "button",
            textContent: "Invalid Button",
            attributes: {
                href: "https://bad.url",
                src: "invalid.png"
            }
        };

        const invalidResult = window.ks['json-to-dom'].validate({ spec: invalidSpec });
        const invalidBadge = document.getElementById("invalid-spec-badge");
        if (invalidBadge) {
            invalidBadge.className = invalidResult.isValid ? "badge bg-success" : "badge bg-danger";
            invalidBadge.textContent = `Caught ${invalidResult.errors.length} Schema Violations`;
        }

        const invalidBox = document.getElementById("invalid-spec-output-box");
        if (invalidBox) {
            invalidBox.textContent = JSON.stringify(invalidResult, null, 2);
        }

        console.log("[v24] Live DOM rendered.");
        console.log("[v24] Static HTML String generated:\n", htmlString);
        console.log("[v24] Validation reports:", validationReports);
        console.log("[v24] Invalid spec test:", invalidResult);
    } catch (err) {
        console.error("Failed to render v24 sample:", err);
    }
};

startFunc();
