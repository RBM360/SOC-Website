import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => file.endsWith(".html"));
const checkedExtensions = new Set([".css", ".js", ".jpg", ".jpeg", ".png", ".ttf", ".html"]);
const problems = [];

function isExternalReference(value) {
  return /^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(value);
}

function cleanReference(value) {
  return value.split("#")[0].split("?")[0].trim();
}

function resolveReference(fromFile, value) {
  const cleaned = cleanReference(value);

  if (!cleaned || isExternalReference(cleaned)) {
    return null;
  }

  return resolve(join(root, normalize(join(dirname(fromFile), cleaned))));
}

function checkReference(fromFile, value) {
  const resolved = resolveReference(fromFile, value);

  if (!resolved) {
    return;
  }

  if (!resolved.startsWith(root) || !existsSync(resolved)) {
    problems.push(`${fromFile}: missing reference "${value}"`);
    return;
  }

  if (!checkedExtensions.has(extname(resolved).toLowerCase())) {
    return;
  }

  if (!statSync(resolved).isFile()) {
    problems.push(`${fromFile}: reference is not a file "${value}"`);
  }
}

function checkRootReference(fromFile, value) {
  const cleaned = cleanReference(value);

  if (!cleaned || isExternalReference(cleaned)) {
    return;
  }

  const resolved = resolve(join(root, normalize(cleaned)));

  if (!resolved.startsWith(root) || !existsSync(resolved)) {
    problems.push(`${fromFile}: missing reference "${value}"`);
    return;
  }

  if (checkedExtensions.has(extname(resolved).toLowerCase()) && !statSync(resolved).isFile()) {
    problems.push(`${fromFile}: reference is not a file "${value}"`);
  }
}

function checkHtmlFile(file) {
  const source = readFileSync(join(root, file), "utf8");
  const refs = source.matchAll(/\b(?:src|href|data-full-src)=["']([^"']+)["']/g);

  for (const [, value] of refs) {
    checkReference(file, value);
  }

  if (!source.includes('<meta name="viewport" content="width=device-width, initial-scale=1">')) {
    problems.push(`${file}: missing mobile viewport meta tag`);
  }
}

function checkCssFile(file) {
  const source = readFileSync(join(root, file), "utf8");
  const refs = source.matchAll(/url\(["']?([^"')]+)["']?\)/g);

  for (const [, value] of refs) {
    checkReference(file, value);
  }
}

function checkScriptFile(file) {
  const source = readFileSync(join(root, file), "utf8");
  const refs = source.matchAll(/["']((?:\.\.\/)?assets\/[^"']+)["']/g);

  for (const [, value] of refs) {
    checkRootReference(file, value);
  }
}

for (const file of htmlFiles) {
  checkHtmlFile(file);
}

checkCssFile("styles/site.css");
checkScriptFile("scripts/site.js");

if (!existsSync(join(root, "index.html"))) {
  problems.push("index.html is required for static hosting");
}

if (problems.length) {
  console.error("Site validation failed:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`Site validation passed for ${htmlFiles.length} HTML files.`);
