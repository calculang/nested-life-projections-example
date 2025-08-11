// write out bundle

import { resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import { compile } from "calculang/packages/standalone/index.js";

const cwd = import.meta.dirname;

const m = await compile({
  entrypoint: "capital-requirements.cul.js",
  fs: {
    "capital-requirements.cul.js": await readFile(
      resolve(cwd, "../src/capital-requirements.cul.js"),
      "utf8"
    ),
    "./term.cul.js": await readFile(resolve(cwd, "../src/term.cul.js"), "utf8"),
  },
  memo: true,
});

await writeFile(resolve(cwd, "capital-requirements.js"), m.compilations[0].code);
await writeFile(resolve(cwd, "term.js"), m.compilations[1].code);

await writeFile(resolve(cwd, "bundle.js"), m.bundle);
