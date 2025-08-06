let model = {}; 



////////////// cul scope id 0 //////////

// Since I want to share this example using the Playground UI,
// it includes a little more code than strictly necessary
// Different logical pieces are broken up and there is heavy commentary (Feedback welcomed)

// This is only one configuration of nesting, and not a precise replica of patterns I use in other calculang models. Like nested.py itself, this is intended for illustration, comparison and discussion.



// we change or 'override' the definition of q_x by adding new prudence controls.
// In calculang we can do this without refactoring things that use q_x (because of 'input inference').
// We apply prudence at time >= `t_inner`; prudence_factor_in is 1 by default so that no prudence is applied except where specified in capital_requirement calculation.
// `q_x_` inside this definition refers to the original definition of q_x, imported from term.cul.js

export const s0_q_x$ = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) >= s0_t_inner({ t_inner_in })) return s1_q_x_({}) * s0_prudence_factor({ prudence_factor_in });else
  return 0;
};

// new prudence controls inputs
// (?? is the concise Javascript "nullish coalescing operator"; commonly used in exactly this pattern to populate default input values in calculang):
// (applications can pass custom input values to query different results from a model. Formulas can also manipulate input values - as in the capital_requirements formula which follows)
export const s0_t_inner = ({ t_inner_in }) => t_inner_in ?? -1;
export const s0_prudence_factor = ({ prudence_factor_in }) => prudence_factor_in ?? 1;

// Now we use prudence controls
export const s0_capital_requirement$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) =>
(s1_fut_claims({ term_m_in, t_in: s1_t({ t_in }) + 1, t_inner_in: s1_t({ t_in }), prudence_factor_in: 1.2 }) +
s1_fut_premiums({ term_m_in, premium_in, t_in: s1_t({ t_in }), t_inner_in: s1_t({ t_in }), prudence_factor_in: 1.2 })) * // the prudence effect on premiums is second-order
s1_num_pols_if({ t_in, t_inner_in, prudence_factor_in });
// In nested.py the first month of claims is always 0 in the Term projection, => never used in the capital requirements
// (apparent in the screenshot https://github.com/actuarialopensource/methodology/blob/main/nested/nested_py_output.png)
// This timing distinction means I can't replicate values exactly by using `fut_net_cashflow` directly

export const s0_capital_change$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (s1_t({ t_in }) == 0) return s0_capital_requirement({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });else
  return s0_capital_requirement({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) - s0_capital_requirement({ term_m_in, t_inner_in, prudence_factor_in, premium_in, t_in: s1_t({ t_in }) - 1 });
};

// surface capital change for visualization in Playground UI:
export const s0_pv_placeholder$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => s0_capital_change({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });



////////////// cul scope id 1 //////////

// On it's own these formulas reproduce nesting.py Term class cashflows (Premiums and Claims)
// For proof just check some values after deleting all the new formula definitions in capital.cul.js

export const s1_premiums$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (s1_t({ t_in }) >= 0 && s1_t({ t_in }) < s1_term_m({ term_m_in }) - 1) return s1_num_pols_if({ t_in, t_inner_in, prudence_factor_in }) * s1_premium({ premium_in }) / 12;else
  return 0;
};

export const s1_claims$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) >= 0 && s1_t({ t_in }) < s1_term_m({ term_m_in })) return -s1_num_deaths({ t_in, t_inner_in, prudence_factor_in }) * s1_sum_assured({});else
  return 0;
};

export const s1_num_pols_if$ = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) == 0) return 1;else
  return s1_num_pols_if({ t_inner_in, prudence_factor_in, t_in: s1_t({ t_in }) - 1 }) - s1_num_deaths({ t_inner_in, prudence_factor_in, t_in: s1_t({ t_in }) - 1 });
};

export const s1_num_deaths$ = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) == 0) return 0;else
  return s1_num_pols_if({ t_inner_in, prudence_factor_in, t_in: s1_t({ t_in }) - 1 }) * s0_q_x({ t_inner_in, prudence_factor_in, t_in: s1_t({ t_in }) - 1 });
};

export const s1_q_x_ = ({}) => 0.001;

export const s1_net_cashflow$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => s1_premiums({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) + s1_claims({ t_in, term_m_in, t_inner_in, prudence_factor_in }); // note signs

// future sums
// specific (prudent) projections of these are used in calculation of capital.cul.js
// These formulas can be hoisted there

export const s1_fut_net_cashflow$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (s1_t({ t_in }) > s1_term_m({ term_m_in })) return 0;
  return s1_fut_net_cashflow({ term_m_in, t_inner_in, prudence_factor_in, premium_in, t_in: s1_t({ t_in }) + 1 }) + s1_net_cashflow({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });
};

export const s1_fut_premiums$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (s1_t({ t_in }) >= s1_term_m({ term_m_in })) return 0;
  return s1_fut_premiums({ term_m_in, t_inner_in, prudence_factor_in, premium_in, t_in: s1_t({ t_in }) + 1 }) + s1_premiums({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });
};

export const s1_fut_claims$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) >= s1_term_m({ term_m_in })) return 0;
  return s1_fut_claims({ term_m_in, t_inner_in, prudence_factor_in, t_in: s1_t({ t_in }) + 1 }) + s1_claims({ t_in, term_m_in, t_inner_in, prudence_factor_in });
};

// Playground UI uses this to determine # months of results to take from model
export const s1_proj_len$ = ({ term_m_in }) => s1_term_m({ term_m_in });

// Playground UI uses specific pv_ formula names for visualization:
export const s1_pv_premiums$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => 1 * s1_premiums({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });
export const s1_pv_claims$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in }) => 1 * s1_claims({ t_in, term_m_in, t_inner_in, prudence_factor_in });

// some things which effectively aren't used at all in calculang implementation:

export const s1_age$ = ({ start_age_in, t_in }) => s1_start_age({ start_age_in }) + Math.floor(s1_t({ t_in }) / 12);
export const s1_term_remaining$ = ({ term_m_in, t_in }) => s1_term_m({ term_m_in }) - s1_t({ t_in });

// inputs:
export const s1_t = ({ t_in }) => t_in;

// setting default values from model point data specified in nested.py __main__ block
export const s1_term_m = ({ term_m_in }) => term_m_in ?? 120;
export const s1_premium = ({ premium_in }) => premium_in ?? 1300;
export const s1_sum_assured$ = ({}) => 100_000; // for interactive sum assured in Playground UI use:  sum_assured_in ?? 100_000
export const s1_start_age = ({ start_age_in }) => start_age_in ?? 30; // not used


export const s0_q_x$m = memoize(s0_q_x$, ({t_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, t_inner_in, prudence_factor_in})).toString()); 
export const s0_q_x = ({t_in, t_inner_in, prudence_factor_in}) => s0_q_x$m({t_in, t_inner_in, prudence_factor_in})
model['s0_q_x'] = s0_q_x

export const s0_capital_requirement$m = memoize(s0_capital_requirement$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s0_capital_requirement = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s0_capital_requirement$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s0_capital_requirement'] = s0_capital_requirement

export const s0_capital_change$m = memoize(s0_capital_change$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s0_capital_change = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s0_capital_change$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s0_capital_change'] = s0_capital_change

export const s0_pv_placeholder$m = memoize(s0_pv_placeholder$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s0_pv_placeholder = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s0_pv_placeholder$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s0_pv_placeholder'] = s0_pv_placeholder

export const s1_premiums$m = memoize(s1_premiums$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s1_premiums = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s1_premiums$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s1_premiums'] = s1_premiums

export const s1_claims$m = memoize(s1_claims$, ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in})).toString()); 
export const s1_claims = ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => s1_claims$m({t_in, term_m_in, t_inner_in, prudence_factor_in})
model['s1_claims'] = s1_claims

export const s1_num_pols_if$m = memoize(s1_num_pols_if$, ({t_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, t_inner_in, prudence_factor_in})).toString()); 
export const s1_num_pols_if = ({t_in, t_inner_in, prudence_factor_in}) => s1_num_pols_if$m({t_in, t_inner_in, prudence_factor_in})
model['s1_num_pols_if'] = s1_num_pols_if

export const s1_num_deaths$m = memoize(s1_num_deaths$, ({t_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, t_inner_in, prudence_factor_in})).toString()); 
export const s1_num_deaths = ({t_in, t_inner_in, prudence_factor_in}) => s1_num_deaths$m({t_in, t_inner_in, prudence_factor_in})
model['s1_num_deaths'] = s1_num_deaths

export const s1_net_cashflow$m = memoize(s1_net_cashflow$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s1_net_cashflow = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s1_net_cashflow$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s1_net_cashflow'] = s1_net_cashflow

export const s1_fut_net_cashflow$m = memoize(s1_fut_net_cashflow$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s1_fut_net_cashflow = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s1_fut_net_cashflow$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s1_fut_net_cashflow'] = s1_fut_net_cashflow

export const s1_fut_premiums$m = memoize(s1_fut_premiums$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s1_fut_premiums = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s1_fut_premiums$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s1_fut_premiums'] = s1_fut_premiums

export const s1_fut_claims$m = memoize(s1_fut_claims$, ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in})).toString()); 
export const s1_fut_claims = ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => s1_fut_claims$m({t_in, term_m_in, t_inner_in, prudence_factor_in})
model['s1_fut_claims'] = s1_fut_claims

export const s1_proj_len$m = memoize(s1_proj_len$, ({term_m_in}) => Object.values(({term_m_in})).toString()); 
export const s1_proj_len = ({term_m_in}) => s1_proj_len$m({term_m_in})
model['s1_proj_len'] = s1_proj_len

export const s1_pv_premiums$m = memoize(s1_pv_premiums$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s1_pv_premiums = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s1_pv_premiums$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s1_pv_premiums'] = s1_pv_premiums

export const s1_pv_claims$m = memoize(s1_pv_claims$, ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in})).toString()); 
export const s1_pv_claims = ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => s1_pv_claims$m({t_in, term_m_in, t_inner_in, prudence_factor_in})
model['s1_pv_claims'] = s1_pv_claims

export const s1_age$m = memoize(s1_age$, ({start_age_in, t_in}) => Object.values(({start_age_in, t_in})).toString()); 
export const s1_age = ({start_age_in, t_in}) => s1_age$m({start_age_in, t_in})
model['s1_age'] = s1_age

export const s1_term_remaining$m = memoize(s1_term_remaining$, ({term_m_in, t_in}) => Object.values(({term_m_in, t_in})).toString()); 
export const s1_term_remaining = ({term_m_in, t_in}) => s1_term_remaining$m({term_m_in, t_in})
model['s1_term_remaining'] = s1_term_remaining

export const s1_sum_assured$m = memoize(s1_sum_assured$, ({}) => Object.values(({})).toString()); 
export const s1_sum_assured = ({}) => s1_sum_assured$m({})
model['s1_sum_assured'] = s1_sum_assured
  // from https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-esm.js

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = (hasher ? hasher.apply(this, arguments) : key); // DN removed forced string coersion, undo?
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Internal function to check whether `key` is an own property name of `obj`.
function has$1(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}





export const premiums = s1_premiums; model['premiums'] = premiums; ;
export const claims = s1_claims; model['claims'] = claims; ;
export const num_pols_if = s1_num_pols_if; model['num_pols_if'] = num_pols_if; ;
export const num_deaths = s1_num_deaths; model['num_deaths'] = num_deaths; ;
export const q_xw = s1_q_x_; model['q_xw'] = q_xw; ;
export const net_cashflow = s1_net_cashflow; model['net_cashflow'] = net_cashflow; ;
export const fut_net_cashflow = s1_fut_net_cashflow; model['fut_net_cashflow'] = fut_net_cashflow; ;
export const fut_premiums = s1_fut_premiums; model['fut_premiums'] = fut_premiums; ;
export const fut_claims = s1_fut_claims; model['fut_claims'] = fut_claims; ;
export const proj_len = s1_proj_len; model['proj_len'] = proj_len; ;
export const pv_premiums = s1_pv_premiums; model['pv_premiums'] = pv_premiums; ;
export const pv_claims = s1_pv_claims; model['pv_claims'] = pv_claims; ;
export const age = s1_age; model['age'] = age; ;
export const term_remaining = s1_term_remaining; model['term_remaining'] = term_remaining; ;
export const t = s1_t; model['t'] = t; ;
export const term_m = s1_term_m; model['term_m'] = term_m; ;
export const premium = s1_premium; model['premium'] = premium; ;
export const sum_assured = s1_sum_assured; model['sum_assured'] = sum_assured; ;
export const start_age = s1_start_age; model['start_age'] = start_age; 






////////// defaults (imports above tho): ////

export const q_x = s0_q_x; model['q_x'] = q_x;
export const t_inner = s0_t_inner; model['t_inner'] = t_inner;
export const prudence_factor = s0_prudence_factor; model['prudence_factor'] = prudence_factor;
export const capital_requirement = s0_capital_requirement; model['capital_requirement'] = capital_requirement;
export const capital_change = s0_capital_change; model['capital_change'] = capital_change;
export const pv_placeholder = s0_pv_placeholder; model['pv_placeholder'] = pv_placeholder


model['s0_q_x$'] = s0_q_x$;
model['s0_t_inner'] = s0_t_inner;
model['s0_prudence_factor'] = s0_prudence_factor;
model['s0_capital_requirement$'] = s0_capital_requirement$;
model['s0_capital_change$'] = s0_capital_change$;
model['s0_pv_placeholder$'] = s0_pv_placeholder$;
model['s1_premiums$'] = s1_premiums$;
model['s1_claims$'] = s1_claims$;
model['s1_num_pols_if$'] = s1_num_pols_if$;
model['s1_num_deaths$'] = s1_num_deaths$;
model['s1_q_x_'] = s1_q_x_;
model['s1_net_cashflow$'] = s1_net_cashflow$;
model['s1_fut_net_cashflow$'] = s1_fut_net_cashflow$;
model['s1_fut_premiums$'] = s1_fut_premiums$;
model['s1_fut_claims$'] = s1_fut_claims$;
model['s1_proj_len$'] = s1_proj_len$;
model['s1_pv_premiums$'] = s1_pv_premiums$;
model['s1_pv_claims$'] = s1_pv_claims$;
model['s1_age$'] = s1_age$;
model['s1_term_remaining$'] = s1_term_remaining$;
model['s1_t'] = s1_t;
model['s1_term_m'] = s1_term_m;
model['s1_premium'] = s1_premium;
model['s1_sum_assured$'] = s1_sum_assured$;
model['s1_start_age'] = s1_start_age;

