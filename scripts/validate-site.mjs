import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => file.endsWith(".html"));
const checkedExtensions = new Set([".css", ".js", ".jpg", ".jpeg", ".png", ".ttf", ".html", ".ics"]);
const requiredHeaders = [
  "Content-Security-Policy",
  "Referrer-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Permissions-Policy",
  "Strict-Transport-Security"
];
const problems = [];

function isExternalReference(value) {
  return /^(https?:|mailto:|tel:|#|data:)/i.test(value);
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

  if (!source.includes('<meta name="referrer" content="strict-origin-when-cross-origin">')) {
    problems.push(`${file}: missing strict referrer policy meta tag`);
  }

  if (/\s(?:href|src)=["']javascript:/i.test(source)) {
    problems.push(`${file}: javascript: URLs are not allowed`);
  }

  if (/\son[a-z]+=/i.test(source)) {
    problems.push(`${file}: inline event handlers are not allowed`);
  }

  const externalHttpRefs = source.match(/\b(?:src|href)=["']http:\/\/(?!127\.0\.0\.1|localhost)/gi);
  if (externalHttpRefs) {
    problems.push(`${file}: external links and assets must use https`);
  }

  const anchors = source.matchAll(/<a\b[^>]*>/gi);
  for (const [anchor] of anchors) {
    if (!/\btarget=["']_blank["']/i.test(anchor)) {
      continue;
    }

    const rel = anchor.match(/\brel=["']([^"']+)["']/i)?.[1].toLowerCase() || "";
    if (!rel.split(/\s+/).includes("noopener") || !rel.split(/\s+/).includes("noreferrer")) {
      problems.push(`${file}: target="_blank" links must include rel="noopener noreferrer"`);
    }
  }

  const images = source.matchAll(/<img\b[^>]*>/gi);
  for (const [image] of images) {
    if (!/\balt=["'][^"']*["']/i.test(image)) {
      problems.push(`${file}: image is missing alt text`);
    }
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

if (!existsSync(join(root, "_headers"))) {
  problems.push("_headers is required for static host security defaults");
} else {
  const headers = readFileSync(join(root, "_headers"), "utf8");

  for (const header of requiredHeaders) {
    if (!headers.includes(`${header}:`)) {
      problems.push(`_headers: missing ${header}`);
    }
  }
}

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
