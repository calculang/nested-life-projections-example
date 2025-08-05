import { premiums, claims, num_pols_if, num_deaths, q_x_ as q_xw, t, term_m, premium, sum_assured } from "./term.cul.js?cul_scope_id=1&cul_parent_scope_id=0";

export const q_x = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (t({ t_in }) >= t_inner({ t_inner_in })) return q_xw({}) * prudence_factor({ prudence_factor_in });else
  return q_xw({});
};

export const t_inner = ({ t_inner_in }) => t_inner_in ?? 9999;
export const prudence_factor = ({ prudence_factor_in }) => prudence_factor_in ?? 1;

export const capital_requirement = ({ t_in, term_m_in, premium_in }) =>
fut_claims({ term_m_in, t_in: t({ t_in }) + 1, t_inner_in: t({ t_in }), prudence_factor_in: 1.2 }) +
fut_premiums({ term_m_in, premium_in, t_in: t({ t_in }), t_inner_in: t({ t_in }), prudence_factor_in: 1.2 });

export const capital_change = ({ t_in, term_m_in, premium_in }) => {
  if (t({ t_in }) == 0) return capital_requirement({ t_in, term_m_in, premium_in });else
  return capital_requirement({ t_in, term_m_in, premium_in }) - capital_requirement({ term_m_in, premium_in, t_in: t({ t_in }) - 1 });
};

export const fut_premiums = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (t({ t_in }) >= term_m({ term_m_in })) return 0;
  return fut_premiums({ term_m_in, t_inner_in, prudence_factor_in, premium_in, t_in: t({ t_in }) + 1 }) + premiums({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in });
};

export const fut_claims = ({ t_in, term_m_in, t_inner_in, prudence_factor_in }) => {
  if (t({ t_in }) > term_m({ term_m_in }) - 1) return 0;
  return fut_claims({ term_m_in, t_inner_in, prudence_factor_in, t_in: t({ t_in }) + 1 }) + claims({ t_in, term_m_in, t_inner_in, prudence_factor_in });
};