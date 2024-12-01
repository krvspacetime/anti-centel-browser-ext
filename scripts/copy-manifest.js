/* eslint-env node */
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as fs from "fs";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.argv[2]; // 'dev' or 'prod'
const sourceFile = env === "dev" ? "manifest.dev.json" : "manifest.prod.json";
const targetDir = "dist";

// Create dist directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

// Copy the manifest file from public folder
fs.copyFileSync(
  path.join(__dirname, "..", "public", sourceFile),
  path.join(__dirname, "..", targetDir, "manifest.json"),
);

console.log(`Copied public/${sourceFile} to ${targetDir}/manifest.json`);
