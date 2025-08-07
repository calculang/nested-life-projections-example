let model = {}; 



////////////// cul scope id 0 //////////



export const s0_q_x$ = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) >= s0_t_inner({ t_inner_in })) return s1_q_x_({}) * s0_prudence_factor({ prudence_factor_in });else
  return 0;
};

export const s0_t_inner$ = ({ t_inner_in }) => t_inner_in ?? -1;
export const s0_prudence_factor$ = ({ prudence_factor_in }) => prudence_factor_in ?? 1;

export const s0_capital_requirement$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) =>
(s0_fut_claims({ term_m_in, t_in: s1_t({ t_in }) + 1, t_inner_in: s1_t({ t_in }), prudence_factor_in: 1.2 }) +
s0_fut_premiums({ term_m_in, premium_in, t_in: s1_t({ t_in }), t_inner_in: s1_t({ t_in }), prudence_factor_in: 1.2 })) *
s1_num_pols_if({ t_in, t_inner_in, prudence_factor_in });

export const s0_capital_change$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (s1_t({ t_in }) == 0) return s0_capital_requirement({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });else
  return s0_capital_requirement({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) - s0_capital_requirement({ term_m_in, t_inner_in, prudence_factor_in, premium_in, t_in: s1_t({ t_in }) - 1 });
};

export const s0_fut_premiums$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (s1_t({ t_in }) >= s1_term_m({ term_m_in })) return 0;
  return s0_fut_premiums({ term_m_in, t_inner_in, prudence_factor_in, premium_in, t_in: s1_t({ t_in }) + 1 }) + s1_premiums({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });
};

export const s0_fut_claims$ = ({ t_in, term_m_in, t_inner_in, prudence_factor_in }) => {
  if (s1_t({ t_in }) >= s1_term_m({ term_m_in })) return 0;
  return s0_fut_claims({ term_m_in, t_inner_in, prudence_factor_in, t_in: s1_t({ t_in }) + 1 }) + s1_claims({ t_in, term_m_in, t_inner_in, prudence_factor_in });
};



////////////// cul scope id 1 //////////

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

export const s1_q_x_$ = ({}) => 0.001;

// For minimal I moved `fut_x` formulas over to capital-requirements.cul.js

// inputs:
export const s1_t$ = ({ t_in }) => t_in;

export const s1_term_m$ = ({ term_m_in }) => term_m_in ?? 120;
export const s1_premium$ = ({ premium_in }) => premium_in ?? 1300;
export const s1_sum_assured$ = ({}) => 100_000;


export const s0_q_x$m = memoize(s0_q_x$, ({t_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, t_inner_in, prudence_factor_in})).toString()); 
export const s0_q_x = ({t_in, t_inner_in, prudence_factor_in}) => s0_q_x$m({t_in, t_inner_in, prudence_factor_in})
model['s0_q_x'] = s0_q_x

export const s0_t_inner$m = memoize(s0_t_inner$, ({t_inner_in}) => Object.values(({t_inner_in})).toString()); 
export const s0_t_inner = ({t_inner_in}) => s0_t_inner$m({t_inner_in})
model['s0_t_inner'] = s0_t_inner

export const s0_prudence_factor$m = memoize(s0_prudence_factor$, ({prudence_factor_in}) => Object.values(({prudence_factor_in})).toString()); 
export const s0_prudence_factor = ({prudence_factor_in}) => s0_prudence_factor$m({prudence_factor_in})
model['s0_prudence_factor'] = s0_prudence_factor

export const s0_capital_requirement$m = memoize(s0_capital_requirement$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s0_capital_requirement = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s0_capital_requirement$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s0_capital_requirement'] = s0_capital_requirement

export const s0_capital_change$m = memoize(s0_capital_change$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s0_capital_change = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s0_capital_change$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s0_capital_change'] = s0_capital_change

export const s0_fut_premiums$m = memoize(s0_fut_premiums$, ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})).toString()); 
export const s0_fut_premiums = ({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in}) => s0_fut_premiums$m({t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in})
model['s0_fut_premiums'] = s0_fut_premiums

export const s0_fut_claims$m = memoize(s0_fut_claims$, ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => Object.values(({t_in, term_m_in, t_inner_in, prudence_factor_in})).toString()); 
export const s0_fut_claims = ({t_in, term_m_in, t_inner_in, prudence_factor_in}) => s0_fut_claims$m({t_in, term_m_in, t_inner_in, prudence_factor_in})
model['s0_fut_claims'] = s0_fut_claims

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

export const s1_q_x_$m = memoize(s1_q_x_$, ({}) => Object.values(({})).toString()); 
export const s1_q_x_ = ({}) => s1_q_x_$m({})
model['s1_q_x_'] = s1_q_x_

export const s1_t$m = memoize(s1_t$, ({t_in}) => Object.values(({t_in})).toString()); 
export const s1_t = ({t_in}) => s1_t$m({t_in})
model['s1_t'] = s1_t

export const s1_term_m$m = memoize(s1_term_m$, ({term_m_in}) => Object.values(({term_m_in})).toString()); 
export const s1_term_m = ({term_m_in}) => s1_term_m$m({term_m_in})
model['s1_term_m'] = s1_term_m

export const s1_premium$m = memoize(s1_premium$, ({premium_in}) => Object.values(({premium_in})).toString()); 
export const s1_premium = ({premium_in}) => s1_premium$m({premium_in})
model['s1_premium'] = s1_premium

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
export const t = s1_t; model['t'] = t; ;
export const term_m = s1_term_m; model['term_m'] = term_m; ;
export const premium = s1_premium; model['premium'] = premium; ;
export const sum_assured = s1_sum_assured; model['sum_assured'] = sum_assured; 






////////// defaults (imports above tho): ////

export const q_x = s0_q_x; model['q_x'] = q_x;
export const t_inner = s0_t_inner; model['t_inner'] = t_inner;
export const prudence_factor = s0_prudence_factor; model['prudence_factor'] = prudence_factor;
export const capital_requirement = s0_capital_requirement; model['capital_requirement'] = capital_requirement;
export const capital_change = s0_capital_change; model['capital_change'] = capital_change;
export const fut_premiums = s0_fut_premiums; model['fut_premiums'] = fut_premiums;
export const fut_claims = s0_fut_claims; model['fut_claims'] = fut_claims


model['s0_q_x$'] = s0_q_x$;
model['s0_t_inner$'] = s0_t_inner$;
model['s0_prudence_factor$'] = s0_prudence_factor$;
model['s0_capital_requirement$'] = s0_capital_requirement$;
model['s0_capital_change$'] = s0_capital_change$;
model['s0_fut_premiums$'] = s0_fut_premiums$;
model['s0_fut_claims$'] = s0_fut_claims$;
model['s1_premiums$'] = s1_premiums$;
model['s1_claims$'] = s1_claims$;
model['s1_num_pols_if$'] = s1_num_pols_if$;
model['s1_num_deaths$'] = s1_num_deaths$;
model['s1_q_x_$'] = s1_q_x_$;
model['s1_t$'] = s1_t$;
model['s1_term_m$'] = s1_term_m$;
model['s1_premium$'] = s1_premium$;
model['s1_sum_assured$'] = s1_sum_assured$;

