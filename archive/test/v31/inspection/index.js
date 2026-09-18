import { validateTag, guardTags } from "../../../src/v31/chapters/chapter1_inspection/index.js";
import data from "../../../src/v31/chapters/chapter1_inspection/standards/index.js";

const testStatusBadge = document.getElementById("test-status-badge");
const test1Badge = document.getElementById("test1-badge");
const test1Output = document.getElementById("test1-output");
const test2Badge = document.getElementById("test2-badge");
const test2Output = document.getElementById("test2-output");
const test3Badge = document.getElementById("test3-badge");
const test3Output = document.getElementById("test3-output");

let allPassed = true;

try {
    const validSpec = {
        tagName: "div",
        attributes: { class: "container", role: "main" },
        children: [
            { tagName: "h1", textContent: "Valid Element" }
        ]
    };
    const report1 = validateTag({ inSpec: validSpec });
    test1Output.textContent = JSON.stringify({ spec: validSpec, report: report1 }, null, 2);
    if (report1.isValid && report1.errors.length === 0) {
        test1Badge.className = "badge bg-success";
        test1Badge.textContent = "PASS";
    } else {
        allPassed = false;
        test1Badge.className = "badge bg-danger";
        test1Badge.textContent = "FAIL";
    }

    const invalidVoidSpec = {
        tagName: "input",
        attributes: { type: "text", name: "username" },
        children: [
            { tagName: "span", textContent: "Child element not allowed in void tag" }
        ]
    };
    const report2 = validateTag({ inSpec: invalidVoidSpec });
    test2Output.textContent = JSON.stringify({ spec: invalidVoidSpec, report: report2 }, null, 2);
    if (!report2.isValid && report2.errors.some(e => e.includes("Void tag '<input>' cannot have children"))) {
        test2Badge.className = "badge bg-success";
        test2Badge.textContent = "PASS: Caught Void Tag Error";
    } else {
        allPassed = false;
        test2Badge.className = "badge bg-danger";
        test2Badge.textContent = "FAIL";
    }

    const report3 = guardTags({ inTags: data.tags, inGuards: data.guards });
    test3Output.textContent = JSON.stringify({
        totalTagsChecked: Object.keys(data.tags).filter(k => k !== "$schema").length,
        guardsRulesUsed: data.guards,
        report: report3
    }, null, 2);
    if (report3.isValid && report3.errors.length === 0) {
        test3Badge.className = "badge bg-success";
        test3Badge.textContent = "PASS: All Levels Compliant";
    } else {
        allPassed = false;
        test3Badge.className = "badge bg-danger";
        test3Badge.textContent = "FAIL";
    }

    if (allPassed) {
        testStatusBadge.className = "badge bg-success px-3 py-2 fs-6";
        testStatusBadge.textContent = "PASS: All Chapter 1 Validations Verified";
    } else {
        testStatusBadge.className = "badge bg-danger px-3 py-2 fs-6";
        testStatusBadge.textContent = "FAIL: Validation Errors Detected";
    }
} catch (error) {
    testStatusBadge.className = "badge bg-danger px-3 py-2 fs-6";
    testStatusBadge.textContent = "ERROR: " + error.message;
    console.error(error);
}
