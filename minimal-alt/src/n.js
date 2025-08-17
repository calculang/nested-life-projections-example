import * as m from './out.bundle.js';
import { calcudata } from "calculang/packages/calcudata/src/index.js";

console.log('capital_change:', m.capital_change({t_in:0}));
console.log('capital_change:', m.capital_change({t_in:1}));
console.log('capital_change:', m.capital_change({t_in:2}));
console.log('premiums:', m.premiums({t_in:0}));
console.log('claims:', m.claims({t_in:1}));

console.log(calcudata)

console.table(      calcudata({
        type: "objects",
        models: [m],
        input_cursors: [
          {
            t_in: 0,
            term_m_in: 120,
            premium_in: 1300,
            start_age_in: 30
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
          //"term_remaining",
        ],
      }))