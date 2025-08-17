import { all_cul } from "./term.cul.js";

export const q_x = () => {
  return q_x_() * prudence_factor();
};

export const prudence_factor = () => prudence_factor_in ?? 1;

export const fut_net_cashflow = () => {
  if (t() >= term_m()) return 0;
  return fut_net_cashflow({ t_in: t() + 1 }) + net_cashflow();
};
    
export const capital_requirement = () =>
  fut_net_cashflow({ t_in: 0, prudence_factor_in: 1.2, term_m_in: term_m() - t() /* or term remaining; plus do age? */ }) *
  num_pols_if();

export const capital_change = () => {
  if (t() == 0) return capital_requirement();
  else return capital_requirement() - capital_requirement({ t_in: t() - 1 });
};
