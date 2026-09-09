#!/usr/bin/env node

import { readdirSync, existsSync, cpSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const srcDir = resolve(packageRoot, "src");

// 1. Parse CLI Arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
    console.log(`
json-to-dom CLI - Zero-Dependency Declarative DOM Compiler

Usage:
  npx json-to-dom [destination-directory] [options]

Arguments:
  destination-directory   Folder to copy the latest engine to (default: ./json-to-dom)

Options:
  -v, --version           Display package and engine version
  -h, --help              Show this help message
  --version-target=<ver>  Specify an explicit version to copy (e.g. --version-target=v10)

Examples:
  npx json-to-dom
  npx json-to-dom ./src/lib/json-to-dom
  npx json-to-dom ./components/dom-builder --version-target=v10
`);
    process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
    console.log("json-to-dom CLI v1.2.1");
    process.exit(0);
}

// 2. Discover Versions in src/
if (!existsSync(srcDir)) {
    console.error("❌ Error: Could not locate 'src' directory in json-to-dom package.");
    process.exit(1);
}

const versionFolders = readdirSync(srcDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^v\d+$/.test(entry.name))
    .map(entry => ({ name: entry.name, n: Number(entry.name.slice(1)) }))
    .sort((a, b) => b.n - a.n);

if (versionFolders.length === 0) {
    console.error("❌ Error: No version folders (v1, v2, ... vN) found in src/.");
    process.exit(1);
}

// 3. Determine Target Version
const explicitVersionArg = args.find(arg => arg.startsWith("--version-target="));
let selectedVersion = versionFolders[0].name; // Highest version by default

if (explicitVersionArg) {
    const targetVer = explicitVersionArg.split("=")[1]?.trim();
    if (versionFolders.some(v => v.name === targetVer)) {
        selectedVersion = targetVer;
    } else {
        console.error(`❌ Error: Requested version '${targetVer}' not found in src/. Available: ${versionFolders.map(v => v.name).join(", ")}`);
        process.exit(1);
    }
}

// 4. Determine Destination Directory
const customDest = args.find(arg => !arg.startsWith("-"));
const destinationPath = resolve(process.cwd(), customDest || "./json-to-dom");

console.log(`\n⚡ json-to-dom CLI`);
console.log(`📦 Discovered highest version: ${selectedVersion}`);
console.log(`📂 Copying engine to: ${destinationPath} ...`);

try {
    const sourceVersionDir = resolve(srcDir, selectedVersion);
    mkdirSync(destinationPath, { recursive: true });

    // Copy the engine version directory
    cpSync(sourceVersionDir, destinationPath, { recursive: true });

    // Also copy docs/tags metadata to <destination>/docs/tags so definitions resolve seamlessly
    const tagsSource = resolve(packageRoot, "docs", "tags");
    if (existsSync(tagsSource)) {
        const tagsDest = resolve(destinationPath, "..", "docs", "tags");
        mkdirSync(tagsDest, { recursive: true });
        cpSync(tagsSource, tagsDest, { recursive: true });
    }

    console.log(`✅ Successfully copied ${selectedVersion} to ${destinationPath}`);
    console.log(`\n🚀 Getting Started:`);
    console.log(`   import { buildSpecElement } from "${customDest || "./json-to-dom"}/index.js";`);
    console.log(`   const dom = buildSpecElement({ inSpec: { tagName: "button", textContent: "Hello" } });\n`);
} catch (error) {
    console.error(`❌ Failed to copy version:`, error.message);
    process.exit(1);
}
