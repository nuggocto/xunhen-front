// Fails the build unless dist/install.sh is the published install.sh of the
// release the site names: the SHA-256 in src/release.ts, that version, and
// the final call that keeps a truncated download from running anything.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { current, installerSha256 } from "../src/release.ts";

const script = await readFile(new URL("../dist/install.sh", import.meta.url));
const actual = createHash("sha256").update(script).digest("hex");
if (actual !== installerSha256) {
  throw new Error(`dist/install.sh has SHA-256 ${actual}, not the reviewed ${installerSha256}`);
}
const text = script.toString("utf8");
if (!text.includes(`version='${current}'`)) {
  throw new Error(`dist/install.sh does not install xunhen ${current}`);
}
if (!text.trimEnd().endsWith('main "$@"')) {
  throw new Error("dist/install.sh must call main only on its last line");
}
console.log(`install.sh matches xunhen ${current}.`);
