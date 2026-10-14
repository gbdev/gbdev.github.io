// Compile website/resources.md from the README of awesome-gbdev.
//
// The README delimits the part of the list that goes on the website with two
// HTML comments (see https://github.com/gbdev/awesome-gbdev/issues/203):
//
//   <!-- gbdev.io:begin body -->
//   <!-- gbdev.io:end body -->
//
// The page is scripts/resources/header.md (front matter, videos, notes and
// anything else that's website-only) followed by that part of the README.
// website/resources.md is not committed: it's generated before every
// `yarn build` (run this script by hand before `yarn dev`). Edit the header
// or the README instead.
//
// Usage:
//   node scripts/build-resources.mjs              # fetch README.md from awesome-gbdev master
//   node scripts/build-resources.mjs <ref>        # fetch it from another branch, tag or commit
//   node scripts/build-resources.mjs ./README.md  # use a local checkout
//
// The source can also be given in the RESOURCES_MD_SRC environment variable,
// which is how it reaches the script when it runs through `yarn build`.
// With neither an argument nor RESOURCES_MD_SRC, README.md is fetched from
// the master branch of awesome-gbdev on GitHub.

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const REPO = "gbdev/awesome-gbdev";
const HEADER = new URL("./resources/header.md", import.meta.url);
const TARGET = new URL("../website/resources.md", import.meta.url);
const BEGIN = "<!-- gbdev.io:begin body -->";
const END = "<!-- gbdev.io:end body -->";

const source = process.argv[2] ?? process.env.RESOURCES_MD_SRC ?? "master";
const isLocal = existsSync(source);

async function loadReadme() {
  if (isLocal) return readFile(source, "utf8");
  const url = `https://raw.githubusercontent.com/${REPO}/${source}/README.md`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url}: ${res.status} ${res.statusText}`);
  return res.text();
}

// Returns what lies strictly between the markers
function extractBody(text) {
  const begin = text.indexOf(BEGIN);
  const end = text.indexOf(END);
  if (begin === -1 || end === -1 || end < begin) {
    throw new Error(`README.md: missing or misplaced "${BEGIN}" / "${END}" markers`);
  }
  if (text.indexOf(BEGIN, begin + 1) !== -1 || text.indexOf(END, end + 1) !== -1) {
    throw new Error("README.md: markers must appear exactly once");
  }
  return text.slice(begin + BEGIN.length, end);
}

// Links relative to the awesome-gbdev repository (e.g. EMULATORS.md) don't
// exist on the website: point them to GitHub instead.
function absolutizeLinks(md) {
  return md.replace(/\]\((?!https?:|mailto:|#|\/)([^)\s]+)\)/g,
    (_, path) => `](https://github.com/${REPO}/blob/master/${path})`);
}

const readme = (await loadReadme()).replace(/\r\n/g, "\n");
const body = absolutizeLinks(extractBody(readme)).trim();
const header = (await readFile(HEADER, "utf8")).trimEnd();

await writeFile(TARGET, `${header}\n\n${body}\n`);
console.log(`resources.md built from ${isLocal ? source : `${REPO}@${source}`}.`);
