// Since I want to share this example using the Playground UI,
// it includes a little more code than strictly necessary
// Different logical pieces are broken up and there is heavy commentary (Feedback welcomed)

// This is only one configuration of nesting, and not a precise replica of patterns I use in other calculang models. Like nested.py itself, this is intended for illustration, comparison and discussion.

import { premiums, claims, num_pols_if, num_deaths, q_x_ as q_xw, net_cashflow, fut_net_cashflow, fut_premiums, fut_claims, proj_len, pv_premiums, pv_claims, age, term_remaining, t, term_m, premium, sum_assured, start_age } from "./term.cul.js?cul_scope_id=1&cul_parent_scope_id=0";

// we change or 'override' the definition of q_x by adding new prudence controls.
// In calculang we can do this without refactoring things that use q_x (because of 'input inference').
// We apply prudence at time >= `t_inner`; t_inner is 9999 by default (defined below) so that no prudence is applied except where specified in capital_requirement calculation.
// `q_x_` inside this definition refers to the original definition of q_x, imported from term.cul.js

export const q_x = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (t({ t_in }) >= t_inner({ t_inner_in })) return q_xw({}) * prudence_factor({ prudence_factor_in });else
  return q_xw({}); // reference (A)
};

// new prudence controls inputs
// (?? is the concise Javascript "nullish coalescing operator"; commonly used in exactly this pattern to populate default input values in calculang):
// (applications can pass custom input values to query different results from a model. Formulas can also manipulate input values - as in the capital_requirements formula which follows)
export const t_inner = ({ t_inner_in }) => t_inner_in ?? 9999;
export const prudence_factor = ({ prudence_factor_in }) => prudence_factor_in ?? 1;

// Now we use prudence controls
export const capital_requirement = ({ t_in, term_m_in, premium_in }) =>
fut_claims({ term_m_in, t_in: t({ t_in }) + 1, t_inner_in: t({ t_in }), prudence_factor_in: 1.2 }) +
fut_premiums({ term_m_in, premium_in, t_in: t({ t_in }), t_inner_in: t({ t_in }), prudence_factor_in: 1.2 }); // the prudence effect on premiums is second-order
// In nested.py the first month of claims is always 0 in the Term projection, => never used in the capital requirements
// (apparent in the screenshot https://github.com/actuarialopensource/methodology/blob/main/nested/nested_py_output.png)
// This timing distinction means I can't replicate values exactly by using `fut_net_cashflow` directly
// Also we don't multiply by num_pols_if because the projection has an allowance for decrements already;
// Specifically in the line marked reference (A) above, where the original q_x value (and not 0) is applied before t_inner.

export const capital_change = ({ t_in, term_m_in, premium_in }) => {
  if (t({ t_in }) == 0) return capital_requirement({ t_in, term_m_in, premium_in });else
  return capital_requirement({ t_in, term_m_in, premium_in }) - capital_requirement({ term_m_in, premium_in, t_in: t({ t_in }) - 1 });
};

// surface capital change for visualization in Playground UI:
export const pv_placeholder = ({ t_in, term_m_in, premium_in }) => capital_change({ t_in, term_m_in, premium_in });