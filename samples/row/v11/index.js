const startFunc = async () => {
    try {
        const spec = await fetch("/samples/row/v11/spec.json").then(res => res.json());

        // 1. Output 1: Live DOM Node (Clean API, pure fast execution, zero validation overhead)
        window.ks['json-to-dom'].specToDom({
            spec,
            domIdToPushTo: "table-container"
        });

        // 2. Output 2: Static HTML String (Clean API)
        const htmlString = window.ks['json-to-dom'].specToHtml({
            spec
        });

        const outputBox = document.getElementById("html-output-box");
        if (outputBox) {
            outputBox.textContent = htmlString;
        }

        // 3. validate.v2 Multi-Layer Tree Validation
        const v2Result = window.ks['json-to-dom'].validate.v2({ spec });
        const v2Badge = document.getElementById("v2-validation-badge");
        if (v2Badge) {
            v2Badge.className = v2Result.isValid ? "badge bg-success" : "badge bg-danger";
            v2Badge.textContent = v2Result.isValid ? "Valid Spec Tree (100% W3C Valid)" : "Validation Errors";
        }
        const v2Box = document.getElementById("v2-validation-box");
        if (v2Box) {
            v2Box.textContent = JSON.stringify(v2Result, null, 2);
        }

        // 4. Test Hierarchy Violation: <tr> placed directly in <div> (instead of <table>/<tbody>)
        const badHierarchySpec = {
            tagName: "div",
            classList: "misplaced-container",
            children: [
                {
                    tagName: "tr",
                    textContent: "Illegal table row placed outside table"
                }
            ]
        };

        const hierarchyViolation = window.ks['json-to-dom'].validate.v2({ spec: badHierarchySpec });
        const hierarchyBadge = document.getElementById("hierarchy-test-badge");
        if (hierarchyBadge) {
            hierarchyBadge.className = hierarchyViolation.isValid ? "badge bg-success" : "badge bg-danger";
            hierarchyBadge.textContent = `Caught ${hierarchyViolation.hierarchyViolations.length} Hierarchy Violation(s)`;
        }
        const hierarchyBox = document.getElementById("hierarchy-test-box");
        if (hierarchyBox) {
            hierarchyBox.textContent = JSON.stringify({
                path: hierarchyViolation.path,
                violations: hierarchyViolation.hierarchyViolations,
                errors: hierarchyViolation.errors
            }, null, 2);
        }

        // 5. Test Void Element Violation: <input> having children
        const badVoidSpec = {
            tagName: "input",
            attributes: { type: "text", value: "Test" },
            children: [
                { tagName: "span", textContent: "Child inside void input element" }
            ]
        };

        const voidViolation = window.ks['json-to-dom'].validate.v2({ spec: badVoidSpec });
        const voidBadge = document.getElementById("void-test-badge");
        if (voidBadge) {
            voidBadge.className = voidViolation.isValid ? "badge bg-success" : "badge bg-danger";
            voidBadge.textContent = `Caught ${voidViolation.errors.length} Void Rule Violation(s)`;
        }
        const voidBox = document.getElementById("void-test-box");
        if (voidBox) {
            voidBox.textContent = JSON.stringify({
                path: voidViolation.path,
                errors: voidViolation.errors
            }, null, 2);
        }

        console.log("[v25] Live DOM rendered.");
        console.log("[v25] Static HTML String generated:\n", htmlString);
        console.log("[v25] v2 validation result:", v2Result);
        console.log("[v25] Hierarchy violation test:", hierarchyViolation);
        console.log("[v25] Void violation test:", voidViolation);
    } catch (err) {
        console.error("Failed to render v25 sample:", err);
    }
};

startFunc();
