#!/usr/bin/env node
// Installs repo git hooks. Idempotent. Safe to run from `npm install`
// (via the "prepare" script) and in CI (skips silently when not in a
// working git checkout).

import { existsSync, readFileSync, writeFileSync, chmodSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const gitDir = join(repoRoot, ".git");

if (!existsSync(gitDir)) {
  // CI tarball, npm publish, etc. — nothing to do.
  process.exit(0);
}

const hooksDir = join(gitDir, "hooks");
if (!existsSync(hooksDir)) mkdirSync(hooksDir, { recursive: true });

const hookPath = join(hooksDir, "pre-commit");
const marker = "# scripture-journey:pwa-identity-guard";
const block = [
  "",
  marker,
  'node "$(git rev-parse --show-toplevel)/scripts/check-pwa-identity.mjs" || exit $?',
  "",
].join("\n");

let contents = "";
if (existsSync(hookPath)) {
  contents = readFileSync(hookPath, "utf8");
  if (contents.includes(marker)) {
    process.exit(0);
  }
  if (!contents.startsWith("#!")) {
    contents = "#!/bin/sh\n" + contents;
  }
  contents = contents.trimEnd() + "\n" + block;
} else {
  contents = "#!/bin/sh\n" + block;
}

writeFileSync(hookPath, contents);
chmodSync(hookPath, 0o755);
console.log("Installed pre-commit hook: PWA identity guardrail");
