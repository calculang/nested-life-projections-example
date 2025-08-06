// Since I want to share this example using the Playground UI,
// it includes a little more code than strictly necessary
// Different logical pieces are broken up and there is heavy commentary (Feedback welcomed)

// This is only one configuration of nesting, and not a precise replica of patterns I use in other calculang models. Like nested.py itself, this is intended for illustration, comparison and discussion.

import { all_cul } from "./term.cul.js";

// we change or 'override' the definition of q_x by adding new prudence controls.
// In calculang we can do this without refactoring things that use q_x (because of 'input inference').
// We apply prudence at time >= `t_inner`; prudence_factor_in is 1 by default so that no prudence is applied except where specified in capital_requirement calculation.
// `q_x_` inside this definition refers to the original definition of q_x, imported from term.cul.js

export const q_x = () => {
  if (t() >= t_inner()) return q_x_() * prudence_factor();
  else return 0;
};

// new prudence controls inputs
// (?? is the concise Javascript "nullish coalescing operator"; commonly used in exactly this pattern to populate default input values in calculang):
// (applications can pass custom input values to query different results from a model. Formulas can also manipulate input values - as in the capital_requirements formula which follows)
export const t_inner = () => t_inner_in ?? -1;
export const prudence_factor = () => prudence_factor_in ?? 1;

// Now we use prudence controls
export const capital_requirement = () =>
  (fut_claims({ t_in: t() + 1, t_inner_in: t(), prudence_factor_in: 1.2 }) +
    fut_premiums({ t_in: t(), t_inner_in: t(), prudence_factor_in: 1.2 })) * // the prudence effect on premiums is second-order
  num_pols_if();
// In nested.py the first month of claims is always 0 in the Term projection, => never used in the capital requirements
// (apparent in the screenshot https://github.com/actuarialopensource/methodology/blob/main/nested/nested_py_output.png)
// This timing distinction means I can't replicate values exactly by using `fut_net_cashflow` directly

export const capital_change = () => {
  if (t() == 0) return capital_requirement();
  else return capital_requirement() - capital_requirement({ t_in: t() - 1 });
};

// surface capital change for visualization in Playground UI:
export const pv_placeholder = () => capital_change();
