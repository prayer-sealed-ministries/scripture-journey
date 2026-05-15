#!/usr/bin/env node
// Pre-commit guardrail: blocks changes that would trigger Android's
// "Review icon update" WebAPK warning for installed PWA users.
//
// Fails the commit if staged changes touch:
//   - any file under public/icons/
//   - the icons[], id, start_url, or scope fields in public/manifest.json
//
// To intentionally ship an icon/identity change (rare), bypass with:
//   git commit --no-verify
// and accept that every installed user will see the warning once.

import { execSync } from "node:child_process";

const ICON_DIR = "public/icons/";
const MANIFEST = "public/manifest.json";
const IDENTITY_FIELDS = ["icons", "id", "start_url", "scope"];

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function shOrEmpty(cmd) {
  try {
    return sh(cmd);
  } catch {
    return "";
  }
}

const staged = sh("git diff --cached --name-only --diff-filter=ACMRD")
  .split("\n")
  .filter(Boolean);

const iconFiles = staged.filter((f) => f.startsWith(ICON_DIR));
const manifestStaged = staged.includes(MANIFEST);

const violations = [];

if (iconFiles.length > 0) {
  violations.push(
    `Icon files changed under ${ICON_DIR}:\n  - ${iconFiles.join("\n  - ")}`,
  );
}

if (manifestStaged) {
  const oldRaw = shOrEmpty(`git show HEAD:${MANIFEST}`);
  const newRaw = shOrEmpty(`git show :${MANIFEST}`);
  let oldJson = {};
  let newJson = {};
  try {
    oldJson = oldRaw ? JSON.parse(oldRaw) : {};
  } catch {
    violations.push(`${MANIFEST} (HEAD): not valid JSON`);
  }
  try {
    newJson = newRaw ? JSON.parse(newRaw) : {};
  } catch {
    violations.push(`${MANIFEST} (staged): not valid JSON`);
  }
  for (const field of IDENTITY_FIELDS) {
    const before = JSON.stringify(oldJson[field] ?? null);
    const after = JSON.stringify(newJson[field] ?? null);
    if (before !== after) {
      violations.push(
        `${MANIFEST} field "${field}" changed:\n    before: ${before}\n    after:  ${after}`,
      );
    }
  }
}

if (violations.length === 0) {
  process.exit(0);
}

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

process.stderr.write(
  `\n${red(bold("✖ PWA identity guardrail: commit blocked"))}\n\n` +
    `Changing PWA icons or identity fields triggers Android's\n` +
    `"Review icon update" warning for every installed user. The\n` +
    `following staged changes would do that:\n\n` +
    violations.map((v) => `  ${v}`).join("\n\n") +
    `\n\n${yellow("If this is intentional")} (e.g. a real rebrand), bypass with:\n` +
    `  ${bold("git commit --no-verify")}\n` +
    `and accept that installed users will see the warning once.\n\n` +
    `${yellow("If this is accidental")}, unstage the changes:\n` +
    `  ${bold(`git restore --staged ${ICON_DIR} ${MANIFEST}`)}\n\n`,
);
process.exit(1);
