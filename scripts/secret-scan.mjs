import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage"]);
const ignoredFiles = new Set(["package-lock.json"]);
const checks = [
  ["OpenAI style API key", new RegExp("sk-" + "[A-Za-z0-9_-]{20,}")],
  ["GitHub token", new RegExp("gh" + "[oprsu]_[A-Za-z0-9_]{20,}")],
  ["Sanity token env value", new RegExp("SANITY_[A-Z0-9_]*TOKEN\\s*=\\s*.+")],
  ["Private key", new RegExp("BEGIN (RSA|OPENSSH|PRIVATE) KEY")],
  ["Hardcoded Sanity project ID", new RegExp("projectId\\s*[:=]\\s*['\"][A-Za-z0-9]{6,}['\"]")]
];
const matches = [];

scan(root);

if (matches.length > 0) {
  for (const match of matches) {
    console.error(`${match.file}:${match.line}: ${match.name}`);
  }
  process.exit(1);
}

console.log("No secret patterns found.");

function scan(directory) {
  for (const entry of readdirSync(directory)) {
    if (entry.startsWith(".") && entry !== ".github" && entry !== ".gitignore") {
      continue;
    }

    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      if (!ignoredDirectories.has(entry)) {
        scan(path);
      }
      continue;
    }

    if (ignoredFiles.has(entry) || stat.size > 500_000) {
      continue;
    }

    scanFile(path);
  }
}

function scanFile(file) {
  const content = readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const [name, pattern] of checks) {
      if (pattern.test(line)) {
        matches.push({ file: file.replace(root, ""), line: index + 1, name });
      }
    }
  });
}
