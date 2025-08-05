import { expect, describe, it } from 'vitest';

import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

import { compile } from "calculang/packages/standalone/index.js";
import { calcudata } from "calculang/packages/calcudata/src/index.js";

const cwd = import.meta.dirname;

describe("numbers should always rec", async () => {
  const m = await compile({
    entrypoint: "capital-requirements.cul.js",
    fs: {
      "capital-requirements.cul.js": await readFile(
        resolve(cwd, "../src/capital-requirements.cul.js"),
        "utf8"
      ),
      "./term.cul.js": await readFile(
        resolve(cwd, "../src/term.cul.js"),
        "utf8"
      ),
    },
    memo: true,
  });

  it("should match file snapshot exactly", async () => {
    await expect(
      calcudata({
        type: "objects",
        models: [m.js],
        input_cursors: [
          {
            t_in: 0,
            term_m_in: 120,
            premium_in: 1300,
            start_age_in: 30,
            t_inner_in: -1,
            prudence_factor_in: 1,
          },
        ],
        input_domains: {
          t_in: [...Array(120).keys()],
        },
        outputs: [
          "capital_change",
          "capital_requirement",
          "claims",
          "net_cashflow",
          "num_deaths",
          "num_pols_if",
          "premiums",
          "q_x",
          "term_remaining",
        ],
      })
    ).toMatchFileSnapshot("./snapshot/output.json");
  });
});
