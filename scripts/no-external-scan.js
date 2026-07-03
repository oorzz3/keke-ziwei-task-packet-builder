const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = ["index.html", "styles.css", "app.js"];
const patterns = [
  { name: "remote http", re: /http:\/\//i },
  { name: "remote https", re: /https:\/\//i },
  { name: "remote script src", re: /<script[^>]+src=["'](?:https?:)?\/\//i },
  { name: "remote link href", re: /<link[^>]+href=["'](?:https?:)?\/\//i },
  { name: "fetch", re: /\bfetch\s*\(/i },
  { name: "XMLHttpRequest", re: /\bXMLHttpRequest\b/i },
  { name: "localStorage", re: /\blocalStorage\b/i },
  { name: "sessionStorage", re: /\bsessionStorage\b/i },
  { name: "indexedDB", re: /\bindexedDB\b/i },
  { name: "document.cookie", re: /\bdocument\.cookie\b/i },
  { name: "analytics", re: /\banalytics\b|\bgtag\b|GoogleAnalytics/i },
  { name: "cdn", re: /\bcdn\b/i }
];

const failures = [];

for (const file of files) {
  const fullPath = path.join(root, file);
  const content = fs.readFileSync(fullPath, "utf8");
  for (const pattern of patterns) {
    if (pattern.re.test(content)) {
      failures.push(`${file}: ${pattern.name}`);
    }
  }
}

if (failures.length) {
  console.error("no-external-scan failed:");
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log("no-external-scan OK");
